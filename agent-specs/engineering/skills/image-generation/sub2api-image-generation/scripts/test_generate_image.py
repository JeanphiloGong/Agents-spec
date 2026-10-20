import json
import os
import pathlib
import tempfile
import unittest
from unittest.mock import patch

from generate_image import load_config


class LoadConfigTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.auth_path = pathlib.Path(directory.name) / "auth.json"
        self.config_path = pathlib.Path(directory.name) / "config.toml"
        self.auth_path.write_text(json.dumps({"OPENAI_API_KEY": "test-key"}), encoding="utf-8")
        self.config_path.write_text(
            'model_provider = "active"\n'
            '[model_providers.unused]\nbase_url = "https://unused.example/v1"\n'
            '[model_providers.active]\nbase_url = "https://active.example/v1/"\n',
            encoding="utf-8",
        )
        environment = patch.dict(os.environ, {
            "CODEX_AUTH_FILE": str(self.auth_path),
            "CODEX_CONFIG_FILE": str(self.config_path),
            "OPENAI_API_BASE": "",
        })
        environment.start()
        self.addCleanup(environment.stop)

    def test_selects_current_provider_instead_of_first_base_url(self):
        self.assertEqual(load_config(), ("test-key", "https://active.example/v1"))

    def test_environment_address_does_not_override_codex_provider(self):
        os.environ["OPENAI_API_BASE"] = "https://environment.example/v1"
        self.assertEqual(load_config(), ("test-key", "https://active.example/v1"))

    def test_reads_quoted_provider_and_inline_table(self):
        self.config_path.write_text(
            "model_provider = 'active.provider' # current provider\n"
            "[model_providers]\n"
            "'active.provider' = { base_url = 'https://active.example/v1/' }\n",
            encoding="utf-8",
        )
        self.assertEqual(load_config(), ("test-key", "https://active.example/v1"))

    def test_missing_config_does_not_use_environment_address(self):
        self.config_path.unlink()
        os.environ["OPENAI_API_BASE"] = "https://environment.example/v1"
        with self.assertRaisesRegex(RuntimeError, "could not read Codex config file"):
            load_config()

    def test_missing_selected_provider_address_is_rejected(self):
        for config in (
            '[model_providers.unused]\nbase_url = "https://unused.example/v1"\n',
            'model_provider = "absent"\n[model_providers.unused]\n'
            'base_url = "https://unused.example/v1"\n',
            'model_provider = "active"\n[model_providers.active]\n',
            'model_provider = "active"\n[model_providers.active]\nbase_url = " "\n',
            'model_provider = "active"\n[model_providers.active]\nbase_url = 42\n',
        ):
            with self.subTest(config=config):
                self.config_path.write_text(config, encoding="utf-8")
                with self.assertRaisesRegex(RuntimeError, "selected provider base_url is missing"):
                    load_config()

    def test_invalid_toml_is_rejected_without_echoing_its_contents(self):
        self.config_path.write_text('model_provider = "private-value', encoding="utf-8")
        with self.assertRaisesRegex(RuntimeError, "Codex config is not valid TOML") as error:
            load_config()
        self.assertNotIn("private-value", str(error.exception))


if __name__ == "__main__":
    unittest.main()
