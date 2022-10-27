const fs = require("fs");
let url = "https://pool.aterx.com/1/blocks.all.really"; //url of all blocks the pool has found
var data; //parsed data from pool.aterx.com
var webhook_url = "url_here"; //self explanatory
var oldblockhash; //hash of the block that was previously send to Discord

setInterval(function () { //function that runs every 30 seconds
  async function getjson() { //parse data from url
    let response = await fetch(url); 
    data = await response.json();
    return data;
  }

  getjson();
  (async () => {
    var json = await getjson();
    var bheight = json[0]["height"]; //get height value of latest block
    var bhash = json[0]["hash"]; //get hash value of latest block
    var bstatus = json[0]["status"]; //get status value of latest block
    var bdifficulty = json[0]["difficulty"]; //get difficulty value of latest block
    var breward = "0,0" + json[0]["reward"]; //get reward value of latest block

    var params = {
      username: "NEW BLOCK", //set name of Discord Webhook
      avatar_url: "https://www.aterx.com/64x64-aterx-logo.png", //set avatar url of Discord Webhook
      content: "",
      embeds: [ //configure the Embed with all the data previously parsed
        {
          title: "A new block has been found:",
          color: "16056577",
          thumbnail: {
            url: "https://www.aterx.com/64x64-aterx-logo.png"
          },
          "footer": {
             "text": `Data provided by Pool.AteRX.com - Made by Vecto#6472`,
             "icon_url": `https://www.aterx.com/64x64-aterx-logo.png`
          },
          fields: [
            {
              name: "[Height:](`https://pool.aterx.com/1/blockui.html?block=`" + bheight + ")",
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
          ],
          "url": `https://pool.aterx.com/"
        }
      ]
    };

    try { //check hash.txt for oldblockhash and save it to variable                                                   
      oldblockhash = fs.readFileSync("./src/var/hash.txt", "utf8");
      console.log("old1: " + oldblockhash);
    } catch (err) {
      console.error(err);
    }
    
    if (oldblockhash !== bhash) { //check if the latest block hasnt been send before
      console.log("Height: " + bheight); //log height value of latest block to console
      console.log("Hash: " + bhash); //log hash value of latest block to console
      console.log("Status: " + bstatus); //log status value of latest block to console
      console.log("Difficulty: " + bdifficulty); //log difficulty value of latest block to console
      console.log("Reward: " + breward); //log reward value of latest block to console
      oldblockhash = bhash; //update the old block hash to the last block sent

      try { //check if directory exists, and if not make it
        if (!fs.existsSync("src/var")) {
          fs.mkdirSync("src/var");
        }
      } catch (err) {
        console.error(err);
      }

      try { //save latest blockhash to hash.txt
        fs.writeFileSync("./src/var/hash.txt", bhash);
        // file written successfully
      } catch (err) {
        console.error(err);
      }

      console.log("old2:" + oldblockhash); //log the hash of the last block sent
      fetch( //send the previously configured Webhook 
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
      console.log("No new block found"); //log to console that no new block has been found
    }
  })();
}, 30000);
