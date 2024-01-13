const Express = require("express");
const express = Express.Router();
const discovery = require("./../responses/Athena/Discovery/discovery_frontend.json");

express.all(
	"/fortnite/api/discovery/accessToken/:fortniteVersion",
	(req, res) => {
		const useragent = req.headers["user-agent"];
		const regex = useragent.match(/\+\+Fortnite\+Release-\d+\.\d+/);
		res.json({
			branchName: regex[0],
			appId: "Fortnite",
			token: "VcNps1e7qJEqZbQ2tzEb5OOD+JM7McOPu7H4hyap6PE=", //`${crypto.randomBytes(10).toString("hex")}=`,
		});
	}
);

express.post("*/discovery/surface/*", async (req, res) => {
    res.json(discovery);
})

express.post("/links/api/fn/mnemonic", async (req, res) => {
    var MnemonicArray = [];

    for (var i in discovery.Panels[0].Pages[0].results) {
        MnemonicArray.push(discovery.Panels[0].Pages[0].results[i].linkData)
    }

    res.json(MnemonicArray);
})

express.get("/links/api/fn/mnemonic/:playlist/related", async (req, res) => {
    var response = {
        "parentLinks": [],
        "links": {}
    };

    if (req.params.playlist) {
        for (var i in discovery.Panels[0].Pages[0].results) {
            var linkData = discovery.Panels[0].Pages[0].results[i].linkData;
            if (linkData.mnemonic == req.params.playlist) {
                response.links[req.params.playlist] = linkData;
            }
        }        
    }    

    res.json(response);
})

express.get("/links/api/fn/mnemonic/*", async (req, res) => {
    for (var i in discovery.Panels[0].Pages[0].results) {
        if (discovery.Panels[0].Pages[0].results[i].linkData.mnemonic == req.url.split("/").slice(-1)[0]) {
            res.json(discovery.Panels[0].Pages[0].results[i].linkData);
        }
    }
})

module.exports = express;