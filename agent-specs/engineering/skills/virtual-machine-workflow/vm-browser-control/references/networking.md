# Reach a Browser Inside QEMU Windows

Read this only when the new instance does not already have a verified route.
The required chain for QEMU user networking is:

```text
Host 127.0.0.1:19223
  -> QEMU user-net guest:19223
  -> Windows portproxy 19223
  -> Windows 127.0.0.1:9223 (Edge CDP)
```

Each concurrent browser needs distinct debug and guest relay ports; each host
listener needs an unused host port. The numbers here illustrate one instance.
Confirm the VM's netdev ID, guest addressing, existing listeners and rules.

## Windows Relay

For a new instance, run these targeted commands in an elevated guest
PowerShell reached through desktop control. Handle the elevation dialog in the
VM. Run Edge itself from a non-elevated shell. Network changes require the
active task's authorization, and this reference grants none beyond it.

```powershell
$debugPort = 9223
$relayPort = 19223
$ruleName = 'Agent Browser agent-design-02 (QEMU host only)'
netsh interface portproxy show v4tov4
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort
# Proceed only when the proposed relay port and rule name are unallocated.
Start-Service iphlpsvc
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$relayPort connectaddress=127.0.0.1 connectport=$debugPort
if ($LASTEXITCODE -ne 0) { throw 'Portproxy setup failed.' }
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $relayPort -RemoteAddress 10.0.2.2 -Profile Any
```

The host source restriction applies to the usual QEMU user-network gateway
`10.0.2.2`; confirm it for another networking mode. A relay listening on all
guest interfaces needs that firewall restriction and an inspection for any
pre-existing broader allow rules. Do not open the host CDP listener beyond
loopback, disable the firewall, or change unrelated entries.

## QEMU Host Forward

For future starts, the existing `-netdev user` can include this instance's
`hostfwd=tcp:127.0.0.1:19223-:19223`. Do not restart a live user VM merely to
apply it. If authorized, add the route live through QMP's HMP command. Substitute
the confirmed netdev ID and ports; `net0` is an example:

```python
import importlib.util
import os
from pathlib import Path

# desktop_script is the sibling vm-desktop-control/scripts/qmp_desktop.py path.
spec = importlib.util.spec_from_file_location('qmp_desktop', desktop_script)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
runtime = Path(os.environ.get('XDG_RUNTIME_DIR', f'/run/user/{os.getuid()}'))
qmp = module.QMP(runtime / 'windows11/qmp.sock')
try:
    print(qmp.execute('human-monitor-command', {'command-line': 'info usernet'}))
    result = qmp.execute('human-monitor-command', {
        'command-line': 'hostfwd_add net0 tcp:127.0.0.1:19223-:19223',
    })
    if result.strip():
        raise RuntimeError(result)
finally:
    qmp.close()
```

The live forward is temporary until recorded in the user's launcher. Only
persist it when requested or already authorized; report its lifetime otherwise.

## Verify and Recover

```bash
curl --noproxy '*' --fail --max-time 5 http://127.0.0.1:19223/json/version
```

An HTTP proxy should not receive local debugging traffic. Verify the exact
`/json/version` path, then use the skill's WebSocket connector. Diagnose in
order: Edge's guest loopback response, guest portproxy listener/firewall,
QEMU host forward, then host discovery. A failed route is not grounds to
terminate user browsers, reuse a locked profile, or keep adding firewall rules.

For a temporary instance, remove only entries created for that instance after
its owner has finished: `hostfwd_remove net0 tcp:127.0.0.1:19223`,
`netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=19223`,
and `Remove-NetFirewallRule -DisplayName $ruleName`. Retain persistent profiles
unless their deletion is requested; they may contain user authentication.
