import typer

from ..router.channel import router as channel_router
from ..router.log import router as log_router
from ..router.mail import router as mail_router
from ..router.role import router as role_router


app = typer.Typer(help="agent-collab cli")
app.add_typer(role_router, name="role")
app.add_typer(mail_router, name="mail")
app.add_typer(channel_router, name="channel")
app.add_typer(log_router, name="log")


if __name__ == "__main__":
    app()
