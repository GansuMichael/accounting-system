id: crypto.randomUUID()

=

import { generateId } from "./id.js";


id: generateId("txn")



=

generateId("txn")     // transaction
generateId("journal") // journal entry
generateId("audit")   // audit log
generateId("asset")   // asset
generateId("party")   // customer/supplier