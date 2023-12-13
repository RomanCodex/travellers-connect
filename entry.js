import { Web5 } from "@web5/api";
import protocolDefinition from "./assets/protocols.json" assert {type: "json"};

const { web5, did:myDid } = await Web5.connect();
const entryId = "bafyreidg4njkzijvenck7ehl3cgidk2ztvpomerzrumajtomcc4smpwuni";
let entry = {};
async function getEntryById() {
    console.log(myDid);

    const { record } = await web5.dwn.records.read({
        message: {
            filter: {
                recordId: entryId,
            }
        }
    })    
    entry = await record.data.json();
    console.log(entry);
};

getEntryById();