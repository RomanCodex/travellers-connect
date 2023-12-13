import { Web5 } from "@web5/api";
import protocolDefinition from "./assets/protocols.json" assert {type: "json" };

const { web5, did:myDid } = await Web5.connect();

const configureProtocol = async () => {
    const { protocols, status } = await web5.dwn.protocols.query({
        message: {
            filter: {
                protocol: protocolDefinition.protocol,
            }
        }
    });

    if(status.code !== 200) {
        alert('Error querying protocols');
        console.error("Error querying protocols", status);
        return;
    }

    if(protocols.length > 0) {
        console.log("Protocol already exists");
        return;
    }

    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        }
    });
    
    console.log('Protocol configured', configureStatus, protocol);
};

async function loadRecords() {
    await configureProtocol();

    const { records } = await web5.dwn.records.query({
        from: myDid,
        message: {
            filter:{
                schema: protocolDefinition.types.entry.schema,
            },
        }
    });
    let entries = [];

    for (let record of records) {
        const data = await record.data.json();
        const entry = {record, data, id:record.id};
        entries.push(entry);
    };
    console.log("Succesfully fetched entries");
    console.log(entries);
};

//Function to create test entry
const createEntry = async () => {
    const testData = {
        "@type": "entry",
        "title": "Test Entry",
        "description": "This is just a test entry",
        "body": "This is just to test and make sure everything is working properly",
        "author": myDid,
    };

    try {
        const { record } = await web5.dwn.records.create({
            data: testData,
            message: {
                protocol: protocolDefinition.protocol,
                protocolPath: 'entry',
                schema: protocolDefinition.types.entry.schema,
                dataFormat: protocolDefinition.types.entry.dataFormats[0],
            }
        });
        loadRecords();
    } catch (e) {
        console.error(e);
        return;
    }
}

const copyDID = async() => {
    await global.navigator.clipboard.writeText(myDid);
    alert('DID copied to clipboard');
}

createEntry();