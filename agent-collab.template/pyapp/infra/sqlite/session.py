from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, sessionmaker

from ..db.init import Base


def get_engine(db_path: Path):
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return create_engine(f"sqlite:///{db_path}", future=True)


def init_db(engine) -> None:
    Base.metadata.create_all(engine)


def get_session(db_path: Path) -> Session:
    engine = get_engine(db_path)
    init_db(engine)
    session_local = sessionmaker(
        bind=engine,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
    )
    return session_local()


@contextmanager
def session_scope(db_path: Path) -> Iterator[Session]:
    session = get_session(db_path)
    try:
        yield session
        session.commit()
    except IntegrityError:
        session.rollback()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
