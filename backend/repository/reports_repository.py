from models import Report
from sqlmodel import Session
from typing import List
from dao.reports_dao import ReportsDAO, ReportsSQLAlchemy
from sqlalchemy.exc import NoResultFound


class ReportsRepository:
    def __init__(self, db_reporte_ciudadano: Session, reports_dao: ReportsDAO = None):
        self.db_reporte_ciudadano = db_reporte_ciudadano
        self.reports_dao = reports_dao or ReportsSQLAlchemy()

    def read_reports(self) -> List[Report]:
        try:
            for db in self.db_reporte_ciudadano.get_session_generator():
                return self.reports_dao.read_reports(db)
        except NoResultFound as err:
            return err
