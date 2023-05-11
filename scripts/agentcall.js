connect.core.initCCP(containerDiv, {
    ccpUrl: 'https://nikqikdevall.my.connect.aws/ccp-v2',        /*REQUIRED (*** has been replaced) */
    loginPopup: true,               // optional, defaults to `true`
    loginPopupAutoClose: true,      // optional, defaults to `true`
    loginOptions: {                 // optional, if provided opens login in new window
        autoClose: true,              // optional, defaults to `false`
        height: 600,                  // optional, defaults to 578
        width: 400,                   // optional, defaults to 433
        top: 0,                       // optional, defaults to 0
        left: 0
    },
    region: "ap-southeast-2",        /*optional, default TRUE*/
    softphone: {              /*optional*/
        allowFramedSoftphone: true
    }
});

connect.contact(function (contact) {
    connect.core.onAccessDenied(function (contact) {
        window.open("https://nikqikdevall.awsapps.com/connect/login")
    })
    contact.onIncoming(function (contact) {
    });

    contact.onRefresh(function (contact) {
    });

    contact.onAccepted(function (contact) {
    });

    contact.onEnded(function () {

    });

    contact.onConnected(function () {
        initialContactId = contact.getInitialContactId();
        
        var callerName = contact.getAttributes().CallerName;
        var mobileNumber = contact.getAttributes().MobileNumber;
        var callerIssue = contact.getAttributes().CallerIssue;

        console.log(callerName.value);
        console.log(mobileNumber.value);
        console.log(callerIssue.value);
        console.log(contact.getContactId());

        document.getElementById("callerName").textContent = callerName.value;
        document.getElementById("phoneNumber").textContent = mobileNumber.value;
        document.getElementById("contactID").textContent = contact.getContactId();
        document.getElementById("callerIssue").textContent = callerIssue.value;

        if (agentCall) {
            console.log("This is agent to agent call")
            window.ccp.agent.getEndpoints(window.ccp.agent.getAllQueueARNs(), {
                success: function (data) {
                    console.log("Adding connection to selected agent")
                    var selectedIndex = $("#agentCalling").prop('selectedIndex');
                    window.ccp.agent.getContacts(connect.ContactType.VOICE)[0].addConnection(data.endpoints[selectedIndex], {});
                },
                failure: function () {
                    console.log("failed to place the call to the agent");
                }
            });
        }
    });
});

connect.agent(agent => {
    getAgents(agent);
    GetAgentInfo()
    setInterval(function () {
        GetAgentInfo();
    }, 2000);
});

function getAgents(agent) {
    console.log("Generating agent list")
    agent.getEndpoints(agent.getAllQueueARNs(), {
        success: function (data) {
            console.log("fetched the agent list")
            var dropdowns = data.endpoints;
            console.log(dropdowns.length);
            var i;
            var totalOptions = [];
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = new Option(dropdowns[i].name);
                totalOptions.push(openDropdown);
            }
            console.log(totalOptions)
            $("#agentCalling").append(totalOptions);
            $('#agentCalling').on('change', function () {
                console.log($(this).find(":selected").val());
            });
        },
        failure: function () {
            console.log("Failed to generate agent list")
        }
    });
    $("#placeCall").click(() => {
        console.log("Clicked on placing call")
        agentCall = true;
        agent.connect(connect.Endpoint.byPhoneNumber("+61272567820"), {});
    });
}

const GetAgentInfo = () => {
    console.log("Getting Agent info")
    var agent = new connect.Agent
    console.log("Agent Object", agent)
    var config = agent.getConfiguration()
    var agentName = agent.getName()
    var agentStates = agent.getAgentStates();
    var routingProfile = agent.getRoutingProfile();
    var queueARN = routingProfile.defaultOutboundQueue.queueARN;

    document.getElementById("agentName").textContent = agentName;
    document.getElementById("routingProfile").textContent = routingProfile.name;
    document.getElementById("agentQueue").textContent = routingProfile.defaultOutboundQueue.name;

    console.log("Retrived info")
    console.log(agentStates)
    console.log(config)
    console.log(agentName)
    console.log(routingProfile)
    console.log(queueARN)

    // Function to call the API
    callApi();

    async function callApi() {
        try {
            const queueArn = queueARN;
            const instanceId = "13624e6a-435a-479c-97db-d3386a6c4e5e";

            const apiUrl =
                "https://jguhro6rd4.execute-api.ap-southeast-2.amazonaws.com/1?queueArn=" +
                queueArn +
                "&instanceId=" +
                instanceId;

            const response = await fetch(apiUrl);

            const data = await response.json();

            // Process the API response data
            console.log(data);

            // Access the agentOnline value from the response
            const agentOnlineValue = data.agentOnline;
            const contactsWaitingValue = data.contactsInQueue;
            const agentsOnCallValue = data.agentsOnCall;

            // Display the value on the web page
            document.getElementById("agentOnline").textContent = agentOnlineValue;
            document.getElementById("contactsWaiting").textContent = contactsWaitingValue;
            document.getElementById("agentsOnCall").textContent = agentsOnCallValue;
        } catch (error) {
            console.log(error);
        }
    }
} 
