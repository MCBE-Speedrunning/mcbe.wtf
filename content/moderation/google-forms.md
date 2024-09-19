+++
title = 'Google Forms'
summary = 'How we use google forms'
tags = ["service"]
+++

Over the years we have needed to make google forms for various reasons,
most common being new moderator applications. This is the snippet used
to send the application to a discord channel

```js
function onFormSubmit(e) {
  var discordPayload = {
    content: "New form submitted",
    embeds: [{
      type: "rich",
      title: "Form submission",
      color: 65392,
      fields: [],
    }],
  };
  e.response.getItemResponses().forEach(function (i) {
    var v = i.getResponse() || "None";
    discordPayload.embeds[0].fields.push({
      name: i.getItem().getTitle(),
      value: v,
    });
  });
  UrlFetchApp.fetch("https://discord.com/api/webhooks/", {
    method: "post",
    payload: JSON.stringify(discordPayload),
    contentType: "application/json",
  });
}
```

The procedure for using google forms when adding new moderators is as
follows:

1. Get permission from a super mod
2. Create a new private discord channel with a webhook in the scheme
   `#forms_${month_short_code}_${year}`
3. Create the google form and use the snippet above and the webhook URL
4. Test the form
5. Post the form in #announcements
