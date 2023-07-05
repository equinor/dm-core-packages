from typing import Tuple

import requests
import json
from config import config
from services.job_handler_interface import Job, JobHandlerInterface, JobStatus
from utils.logging import logger

_SUPPORTED_TYPE = "dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob"


class JobHandler(JobHandlerInterface):
    def __init__(
            self,
            job: Job,
            data_source: str,
    ):
        super().__init__(job, data_source)
        self.headers = {"Access-Key": job.token}

    def _get_by_id(self, reference: str, depth: int = 1, attribute: str = ""):
        params = {"depth": depth, "attribute": attribute}
        req = requests.get(
            f"{config.DMSS_API}/api/documents/{reference}?resolve_links=true&depth=100", params=params,
            headers=self.headers  # type: ignore
        )  # type: ignore
        req.raise_for_status()
        return req.json()

    def _update(self, reference: str, document: dict):
        form_data = {k: json.dumps(v) if isinstance(v, dict) else str(v) for k, v in document.items()}
        headers = {"Authorization": f"Bearer {self.job.token}", "Access-Key": self.job.token}
        req = requests.put(f"{config.DMSS_API}/api/documents/{reference}", data=form_data, headers=headers,
                           params={"update_uncontained": "False"})
        req.raise_for_status()
        return req.json()

    def start(self) -> str:
        logger.info("Job started")
        applicationInputReference = self.job.entity['applicationInput']['address']
        input_entity = self._get_by_id(applicationInputReference)
        signal_reference: str = f"{input_entity['child_id']}.signal"
        signal_entity = self._get_by_id(signal_reference)
        signal_entity["value"] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99]
        self._update(f"{signal_reference}", {"data": signal_entity})

        return "OK"

    def result(self) -> Tuple[str, bytes]:
        return "Done", b"12345"

    def progress(self) -> Tuple[JobStatus, str]:
        return self.job.status, "Progress tracking not implemented"
