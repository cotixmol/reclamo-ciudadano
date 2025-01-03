from abc import ABC, abstractmethod
from typing import List
from sqlmodel import Session, select
from models.report import Report
from utils import wkb_element_to_geometry_point


class ReportsDAO(ABC):
    @abstractmethod
    def read_reports(self, db: Session) -> List[Report]:
        pass


class ReportsSQLAlchemy(ReportsDAO):
    def read_reports(self, db: Session) -> List[Report]:
        statement = select(Report)
        results = db.exec(statement).all()
        for report in results:
            report.report_location = wkb_element_to_geometry_point(
                report.report_location
            )
        return results
