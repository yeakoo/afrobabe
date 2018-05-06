const Discord = require('discord.js');
const Client = new Discord.Client();
const axios = require('axios');
const utf8 = require('utf8');
const fuzzy = require('fuzzyset.js');
const babes = fuzzy(
    [
        "Joldz",
        "Kenxall",
        "Aura Onyxx",
        "Kaducci",
        "smurfyypurple",
        "Graveldog22",
        "Abused",
        "Eorria",
        "tp",
        "m a g i c",
        "iCarrot",
        "xLegitxKill3rx",
        "Maverick",
        "Pain",
        "Splitbreed",
        "IAmMeSoWhoAreU",
        "spoonz",
        "Yeakoo",
        "AfroNinjaX",
        "xGreeeeny",
        "MasonValdo",
        "SeV",
        "Abyssaal",
        "H4WKEN",
        "TSayneRex",
        "AbusedSociety",
        "DiveEm",
        "Y0LK",
        "Dad",
        "Kendal",
        "Aidenrod991",
        "Papa Legba",
        "Mushra212",
        "Kevin",
        "Winged_Shell"
    ]);
const ids = {
    "Joldz": 4267562,
    "Kenxall": 5808919,
    "AuraOnyxx": 5808998,
    "Kaducci": 5832325,
    "smurfyypurple": 5809085,
    "Graveldog22": 3639794,
    "Abused": 5750975,
    "Eorria": 1689573,
    "tp": 510910,
    "magic": 432179,
    "iCarrot": 4001892,
    "xLegitxKill3rx": 7361190,
    "Maverick": 298967,
    "Pain": 5059322,
    "Splitbreed": 377318,
    "IAmMeSoWhoAreU": 186181,
    "spoonz": 790047,
    "Yeakoo": 771642,
    "AfroNinjaX": 5628521,
    "xGreeeeny": 2206192,
    "MasonValdo": 3546184,
    "SeV": 1633275,
    "Abyssaal": 6949810,
    "H4WKEN": 747115,
    "TSayneRex": 4056870,
    "AbusedSociety": 7960184,
    "DiveEm": 1736731,
    "Y0LK": 3358758,
    "Dad": 5116433,
    "Kendal": 2558762,
    "Aidenrod991": 636439,
    "PapaLegba": 7507303,
    "Mushra212": 1830220,
    "Kevin": 130057,
    "Winged_Shell": 1282198
}

const getPlayer = (dada) => {
    try {
        return axios.get(`https://api.brawlhalla.com/player/${dada}/ranked?api_key=${process.env.api_key}`);
    }
    catch (e) { console.log(e); }
}

Client.on('ready', () => console.log('I\'m ready.'));

Client.on('message', (msg) => {
    let args = msg.content.split(' ');
    if (msg.content.startsWith('?r')) {
        const user = (babes.get(args[1])) ? babes.get(args[1])[0][1] : false;
        let id = ids[user];
        if (user !== false) {
            getPlayer(id).then(data => {
                let result = data.data;
                let name = utf8.decode(data.data['name']);
                let loss = parseInt(result['games']) - parseInt(result['wins']);
                let winrate = ((parseInt(result['wins']) * 100) / parseInt(result['games']));
                let best_team = [2, 0];
                result['2v2'].forEach((team, index) => {
                    if (team.rating > best_team[1]) {
                        best_team[0] = index;
                        best_team[1] = team.rating;
                    }
                });
                // By Rating
                best_team = result['2v2'][best_team[0]];
                best_team['teamname'] = utf8.decode(best_team['teamname'].split('+').join(' & '));
                best_team['winrate'] = ((parseInt(best_team['wins']) * 100) / parseInt(best_team['games']));
                best_team['loss'] = parseInt(best_team['games']) - parseInt(best_team['wins']);

                // By Winrate
                let best_team_two = [2, 0];
                result['2v2'].forEach((team, index) => {
                    if (team.games <= 12) return;
                    let wr = ((parseInt(team['wins']) * 100) / parseInt(team['games']));
                    if (wr > best_team_two[1]) {
                        best_team_two[0] = index;
                        best_team_two[1] = wr
                    }
                });
                best_team_two = result['2v2'][best_team_two[0]];
                best_team_two['teamname'] = utf8.decode(best_team_two['teamname'].split('+').join(' & '));
                best_team_two['winrate'] = ((parseInt(best_team_two['wins']) * 100) / parseInt(best_team_two['games']));
                best_team_two['loss'] = parseInt(best_team_two['games']) - parseInt(best_team_two['wins']);

                const embed = {
                    "title": "Personnal data for my boy " + name,
                    "color": 7917496,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/avatars/158091494748585984/dec2880814c1dd8a1f572e6c39323130.png?size=2048",
                        "text": "Pssh, hey babe, beat em hoes. You got this."
                    },
                    "thumbnail": {
                        "url": "https://i.imgur.com/YNBA0tj.jpg"
                    },
                    "fields": [{
                            "name": "Name",
                            "value": name,
                            "inline": true
                        },
                        {
                            "name": "Region",
                            "value": "Sword. Nuff said.",
                            "inline": true
                        },
                        {
                            "name": "Elooo",
                            "value": "**" + result['tier'] + "** (" + result['rating'] + " / " + result['peak_rating'] + ")",
                            "inline": true
                        },
                        {
                            "name": "Games",
                            "value": "**" + result['games'] + "** (" + result['wins'] + " - " + loss + ")",
                            "inline": true
                        },
                        {
                            "name": "Best Team by Ranking",
                            "value": `${best_team['teamname']}\n**${best_team['tier']}** (${best_team['rating']} / ${best_team['peak_rating']})\n**Winrate**: ${best_team['winrate'].toFixed(2)}% (${best_team['wins']} - ${best_team['loss']})`,
                            "inline": true
                        },
                        {
                            "name": "Best Team by Winrate",
                            "value": `${best_team_two['teamname']}\n**${best_team_two['tier']}** (${best_team_two['rating']} / ${best_team_two['peak_rating']})\n**Winrate**: ${best_team_two['winrate'].toFixed(2)}% (${best_team_two['wins']} - ${best_team_two['loss']})`,
                            "inline": true
                        }
                    ]
                };
                msg.channel.send({ embed });
            });
        }
        else {
            msg.channel.send('Aint no idea who that guy is.');
        }
    }
    else if (msg.content.startsWith('?t')) {
        const user = (babes.get(args[1])) ? babes.get(args[1])[0][1] : false;
        const user_two = (babes.get(args[2])) ? babes.get(args[2])[0][1] : false;
        if (user !== false) {
            if (user_two !== false) {
                let id = ids[user];
                let id_two = ids[user_two];
                getPlayer(id).then(data => {
                    let res = data.data['2v2'];
                    if (typeof res.find(x => x.brawlhalla_id_two === id_two) === "undefined") {
                        if (typeof res.find(x => x.brawlhalla_id_one === id_two) === "undefined") {
                            return msg.channel.send('These two bitches never played together.');
                        }
                        else {
                            let result = res.find(x => x.brawlhalla_id_one === id_two);
                            let team = result['teamname'].split('+');
                            let loss = parseInt(result['games']) - parseInt(result['wins']);
                            result['teamname'] = utf8.decode(result['teamname'].split('+').join(' & '));
                            result['winrate'] = ((parseInt(result['wins']) * 100) / parseInt(result['games']));

                            const embed = {
                                "title": "Team data for my boys " + utf8.decode(team[0]) + " and " + utf8.decode(team[1]),
                                "color": 7917496,
                                "footer": {
                                    "icon_url": "https://cdn.discordapp.com/avatars/158091494748585984/dec2880814c1dd8a1f572e6c39323130.png?size=2048",
                                    "text": "Pssh, hey babe, beat em hoes. You got this."
                                },
                                "thumbnail": {
                                    "url": "https://i.imgur.com/YNBA0tj.jpg"
                                },
                                "fields": [{
                                        "name": "Names",
                                        "value": utf8.decode(team[0]) + " & " + utf8.decode(team[1]),
                                        "inline": true
                                    },
                                    {
                                        "name": "Region",
                                        "value": "Sword. Nuff said.",
                                        "inline": true
                                    },
                                    {
                                        "name": "Elooo",
                                        "value": "**" + result['tier'] + "** (" + result['rating'] + " / " + result['peak_rating'] + ")",
                                        "inline": true
                                    },
                                    {
                                        "name": "Games",
                                        "value": "**" + result['games'] + "** (" + result['wins'] + " - " + loss + ")",
                                        "inline": true
                                    },
                                    {
                                        "name": "Ranking",
                                        "value": `**${result['tier']}** (${result['rating']} / ${result['peak_rating']})\n**Winrate**: ${result['winrate'].toFixed(2)}% (${result['wins']} - ${loss})`,
                                        "inline": true
                                    }
                                ]
                            };
                            msg.channel.send({ embed });
                        }
                    }
                    else {
                        let result = res.find(x => x.brawlhalla_id_two === id_two);
                        let team = result['teamname'].split('+');
                        let loss = parseInt(result['games']) - parseInt(result['wins']);
                        result['teamname'] = utf8.decode(result['teamname'].split('+').join(' & '));
                        result['winrate'] = ((parseInt(result['wins']) * 100) / parseInt(result['games']));

                        const embed = {
                            "title": "Team data for my boys " + utf8.decode(team[0]) + " and " + utf8.decode(team[1]),
                            "color": 7917496,
                            "footer": {
                                "icon_url": "https://cdn.discordapp.com/avatars/158091494748585984/dec2880814c1dd8a1f572e6c39323130.png?size=2048",
                                "text": "Pssh, hey babe, beat em hoes. You got this."
                            },
                            "thumbnail": {
                                "url": "https://i.imgur.com/YNBA0tj.jpg"
                            },
                            "fields": [{
                                    "name": "Names",
                                    "value": utf8.decode(team[0]) + " & " + utf8.decode(team[1]),
                                    "inline": true
                                },
                                {
                                    "name": "Region",
                                    "value": "Sword. Nuff said.",
                                    "inline": true
                                },
                                {
                                    "name": "Elooo",
                                    "value": "**" + result['tier'] + "** (" + result['rating'] + " / " + result['peak_rating'] + ")",
                                    "inline": true
                                },
                                {
                                    "name": "Games",
                                    "value": "**" + result['games'] + "** (" + result['wins'] + " - " + loss + ")",
                                    "inline": true
                                },
                                {
                                    "name": "Ranking",
                                    "value": `**${result['tier']}** (${result['rating']} / ${result['peak_rating']})\n**Winrate**: ${result['winrate'].toFixed(2)}% (${result['wins']} - ${loss})`,
                                    "inline": true
                                }
                            ]
                        };
                        msg.channel.send({ embed });
                    }

                });
            }
            else {
                msg.channel.send('Who tf is even #2?');
            }

        }
        else {
            msg.channel.send('User one not found.');
        }
    }
});
Client.login(process.env.bot_token);
