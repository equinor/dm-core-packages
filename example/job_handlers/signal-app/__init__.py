from typing import Tuple
import random
import requests
import json
from config import config
from services.job_handler_interface import Job, JobHandlerInterface, JobStatus
from utils.logging import logger
import time

_SUPPORTED_TYPE = "dmss://DemoDataSource/apps/MySignalApp/models/SignalGeneratorJob"


class JobHandler(JobHandlerInterface):
    def __init__(
            self,
            job: Job,
            data_source: str,
    ):
        super().__init__(job, data_source)
        self.headers = {"Access-Key": job.token}

    def _get_by_id(self, reference: str, depth: int = 1):
        req = requests.get(
            f"{config.DMSS_API}/api/documents/{reference}?resolve_links=true&depth={depth}",
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
        self.job.status = JobStatus.RUNNING
        logger.info("after sleep")
        application_input_reference = self.job.entity['applicationInput']['address']
        input_entity = self._get_by_id(application_input_reference)
        signal_length = int(input_entity["duration"] / input_entity["timeStep"])
        new_signal_value = [random.randint(-50, 50) for value in range(signal_length)]
        signal_reference: str = self.job.entity['outputTarget']
        signal_entity = self._get_by_id(signal_reference)
        signal_entity["value"] = new_signal_value
        self._update(f"{signal_reference}", {"data": signal_entity})
        self.job.status = JobStatus.COMPLETED
        return "OK"

    def remove(self) -> str:
        logger.info("removing...")
        self.job.status = JobStatus.REMOVED
        self.job.job_uid=""
        return f"removed job with id {self.job.job_uid}"

    def result(self) -> Tuple[str, bytes]:
        return "Done", b"12345"

    def progress(self) -> Tuple[JobStatus, str]:
        return self.job.status, "Progress tracking not implemented"
