const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.post('/updateSiteMap', (req, res) => {
    const challenge = req.body.challenge;
    const bot_id = 'BE5J35KLH';
    const storyblokApi =
        'https://api.storyblok.com/v1/cdn/stories?' +
        process.env.STORYBLOK_TOKEN;
    const githubApi =
        'https://api.github.com/repos/ThomasAndrewMacLean/project-blog/contents/sitemaproutes.js';

    console.log(req.body);
    //check if its the storyblok bot that has published a story.
    if (
        req.body.event.bot_id === bot_id &&
        req.body.event.text.includes('published the Story')
    ) {
        //get all the projects from the storyblok api
        fetch(storyblokApi)
            .then(res => res.json())
            .then(result => {
                const projects = result.stories
                    .filter(story => story.full_slug.includes('projects/'))
                    .map(story => story.full_slug);
                const sitemaproutesString = `module.exports = ["${projects.join(
                    '","'
                )}"]`;

                console.log(sitemaproutesString);
                //send to the github api, and save as new siteroutes.
                //This will trigger travis, and that will in turn deploy the new site.
                fetch(githubApi, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + process.env.GITHUB_TOKEN
                    }
                })
                    .then(res => res.json())
                    .then(result => {
                        console.log('😸');
                        console.log(sitemaproutesString);

                        fetch(githubApi, {
                            method: 'PUT',
                            body: JSON.stringify({
                                message: 'my commit message',
                                committer: {
                                    name: 'ThomasAndrewMacLean',
                                    email: 'hello@thomasmaclean.be'
                                },
                                content: btoa(sitemaproutesString),
                                sha: result.sha
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization:
                                    'Bearer ' + process.env.GITHUB_TOKEN
                            }
                        })
                            .then(res => res.json())
                            .then(result => {
                                console.log(result);
                                //send a message to slack to say the job has been done.
                                fetch(
                                    //get correct hook
                                    'https://hooks.slack.com/services/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',
                                    {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            text: `new pull request to be reviewed! PR:`
                                        }),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }
                                );
                            });
                    });
            });
    }

    res.status(200).json({
        challenge
    });
});
app.get('*/*', function(req, res) {
    res.send('🎄🎄🎄🎄🎄Vrolijke kerst mijn liefste liefje!!!!!!! 😘😘😘😘😘');
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app listening on port ${port}`));
