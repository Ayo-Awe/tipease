import { emailWorker } from "./email.worker";
import { profileImageWorker } from "./profileImage.worker";

export async function startWorkers() {
  emailWorker.run();
  profileImageWorker.run();
}
