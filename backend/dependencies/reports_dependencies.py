from service import ReportsService
from dao import ReportsSQLAlchemy
from repository import ReportsRepository
from db import db_reporte_ciudadano


def get_reports_service() -> ReportsService:
    dao_reports = ReportsSQLAlchemy()
    repository = ReportsRepository(db_reporte_ciudadano, dao_reports)
    return ReportsService(repository=repository)
