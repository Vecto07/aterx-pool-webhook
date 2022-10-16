const fetch = require("node-fetch");
let url = "https://pool.aterx.com/1/blocks.all.really";
var data;
var webhook_url = process.env.webhook_url;
var oldblockhash;

setInterval(function () {
  async function getjson() {
    let response = await fetch(url);
    data = await response.json();
    //console.log(data)
    return data;
  }

  getjson();
  (async () => {
    var json = await getjson();
    //b = block with id 0
    var bheight = json[0]["height"];
    var bhash = json[0]["hash"];
    var bstatus = json[0]["status"];
    var bdifficulty = json[0]["difficulty"];
    var breward = "0,0" + json[0]["reward"];
    console.log("old1:" + oldblockhash);

    var params = {
      username: "NEW BLOCK",
      avatar_url: "https://www.aterx.com/64x64-aterx-logo.png",
      content: "",
      embeds: [
        {
          title: "A new block has been found:",
          color: "16056577",
          thumbnail: {
            url: "https://www.aterx.com/64x64-aterx-logo.png"
          },
          fields: [
            {
              name: "Height:",
              value: bheight,
              inline: false
            },
            {
              name: "Hash:",
              value: bhash,
              inline: false
            },
            {
              name: "Status:",
              value: bstatus,
              inline: false
            },
            {
              name: "Difficulty:",
              value: bdifficulty,
              inline: false
            },
            {
              name: "Reward:",
              value: breward,
              inline: false
            }
          ]
        }
      ]
    };

    if (oldblockhash !== bhash) {
      console.log("Height: " + bheight);
      console.log("Hash: " + bhash);
      console.log("Status: " + bstatus);
      console.log("Difficulty: " + bdifficulty);
      console.log("Reward: " + breward);
      oldblockhash = bhash;
      console.log("old2:" + oldblockhash);
      fetch(
        webhook_url,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(params)
        }
      ).then((res) => {
        console.log(res);
      });
    } else {
      console.log("No new block found");
    }
  })();
}, 600000);
