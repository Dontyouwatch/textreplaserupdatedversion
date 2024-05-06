// Configuration
var apiToken = "BOT_TOKEN";
var appUrl = "WEBAPP_URL";
var apiUrl = "https://api.telegram.org/bot" + apiToken;

// set webhook
function setWebhook() {
  var url = apiUrl + "/setwebhook?url=" + appUrl;
  var res = UrlFetchApp.fetch(url).getContentText();
  Logger.log(res);
}

// handle webhook
function doPost(e) {
  var webhookData = JSON.parse(e.postData.contents);
  var from = webhookData.message.from.id;

  if (webhookData.message.caption) {
    var modifiedCaption = webhookData.message.caption;

    // Add @Dontyouwatch5 to the beginning of the caption if it doesn't contain any usernames
    if (!captionContainsUsername(modifiedCaption)) {
      modifiedCaption = "@Dontyouwatch5 " + modifiedCaption;
    }

    // Replace usernames with @Dontyouwatch5
    modifiedCaption = modifiedCaption.replace(/@[\w_]+/g, "@Dontyouwatch5");

    // Replace links with https://t.me/Dontyouwatch5
    modifiedCaption = modifiedCaption.replace(/https?:\/\/\S+/g, "🎟 𝙹✪𝙸𝙽 »»➤https://t.me/Dontyouwatch5");

    if (webhookData.message.document) {
      sendModifiedDocument(from, webhookData.message.document, modifiedCaption);
    } else if (webhookData.message.video) {
      sendModifiedVideo(from, webhookData.message.video, modifiedCaption);
    } else if (webhookData.message.photo) {
      sendModifiedPhoto(from, webhookData.message.photo, modifiedCaption);
    }
  } else {
    // Add @Dontyouwatch5 to the beginning of the caption if it's empty
    var modifiedCaption = "@Dontyouwatch5";

    if (webhookData.message.document) {
      sendModifiedDocument(from, webhookData.message.document, modifiedCaption);
    } else if (webhookData.message.video) {
      sendModifiedVideo(from, webhookData.message.video, modifiedCaption);
    } else if (webhookData.message.photo) {
      sendModifiedPhoto(from, webhookData.message.photo, modifiedCaption);
    }
  }
}

// Function to send a text message
function sendMessage(chatId, messageText) {
  var sendText = encodeURIComponent(messageText);
  var url = apiUrl + "/sendmessage?parse_mode=HTML&chat_id=" + chatId + "&text=" + sendText;
  var opts = { "muteHttpExceptions": true };
  UrlFetchApp.fetch(url, opts).getContentText();
}

// Function to send a modified document with a caption
function sendModifiedDocument(chatId, document, modifiedCaption) {
  var url = apiUrl + "/senddocument?chat_id=" + chatId;
  var formData = {
    "caption": modifiedCaption,
    "document": document.file_id
  };
  var opts = { "method": "post", "payload": formData, "muteHttpExceptions": true };
  UrlFetchApp.fetch(url, opts);
}

// Function to send a modified video with a caption
function sendModifiedVideo(chatId, video, modifiedCaption) {
  var url = apiUrl + "/sendvideo?chat_id=" + chatId;
  var formData = {
    "caption": modifiedCaption,
    "video": video.file_id
  };
  var opts = { "method": "post", "payload": formData, "muteHttpExceptions": true };
  UrlFetchApp.fetch(url, opts);
}

// Function to send a modified photo with a caption
function sendModifiedPhoto(chatId, photo, modifiedCaption) {
  // Telegram sends photos in an array, we use the last element which has the highest resolution
  var photoSize = photo.length;
  var photoToSend = photo[photoSize - 1];
  
  var url = apiUrl + "/sendphoto?chat_id=" + chatId;
  var formData = {
    "caption": modifiedCaption,
    "photo": photoToSend.file_id
  };
  var opts = { "method": "post", "payload": formData, "muteHttpExceptions": true };
  UrlFetchApp.fetch(url, opts);
}

// Function to check if a caption contains a username
function captionContainsUsername(caption) {
  return /@[\w_]+/.test(caption);
}

function doGet(e) {
  return ContentService.createTextOutput("Method GET not allowed");
}
