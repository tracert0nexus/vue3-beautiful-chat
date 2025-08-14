# vue3-beautiful-chat

Forked from [vue-beautiful-chat](https://github.com/mattmezza/vue-beautiful-chat)

`vue3-beautiful-chat` provides an intercom-like chat window that can be included easily in any project for free. It provides no messaging facilities, only the view component.

`vue3-beautiful-chat` is porting to vue of `react-beautiful-chat` (which you can find [here](https://github.com/mattmezza/react-beautiful-chat))

<a href="https://www.npmjs.com/package/vue3-beautiful-chat" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/vue3-beautiful-chat.svg" />
</a>
<a href="https://github.com/sitronik/vue3-beautiful-chat" target="\_parent">
  <img alt="" src="https://img.shields.io/github/stars/sitronik/vue3-beautiful-chat.svg?style=social&label=Star" />
</a>

Go to [FAQ](#faq) ⬇️

![gif](https://media.giphy.com/media/3ohs4wE4DqXw84xAMo/giphy.gif)

## Features

- Customizeable
- Backend agnostic
- Free

## [Demo](https://mattmezza.github.io/vue-beautiful-chat/)

## Table of Contents
- [Installation](#installation)
- [Example](#example)
- [Components](#components)

## Installation

```
$ yarn add vue3-beautiful-chat
```

## Example
```javascript
import * as Vue from 'vue'
import App from './App.vue'
import Chat from 'vue3-beautiful-chat'

const app = Vue.createApp(App)

app.use(Chat)
```

```vue
<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :minimize="handleMinimize"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showTextInput="showTextInput"
      :showEdition="true"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      :messageMargin="messageMargin"
      :showMinimizeButton="true"
      @onType="handleOnType"
      @edit="editMessage" />
  </div>
</template>
```
```javascript
export default {
  name: 'app',
  data() {
    return {
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
          imageUrl: 'https://avatars3.githubusercontent.com/u/1915989?s=230&v=4'
        },
        {
          id: 'user2',
          name: 'Support',
          imageUrl: 'https://avatars3.githubusercontent.com/u/37018832?s=200&v=4'
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
          { type: 'text', author: `me`, data: { text: `Say yes!` } },
          { type: 'text', author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        },
        emojiPicker: {
            bg: 'white',
            text: '#b8c3ca'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
      messageMargin: { system: '25px auto' }, // sets the margin for the system messages
      acceptedFileTypes: ['image/*', 'audio/*'] // sets the accepted file types for the file input, in this example it accepts only images and audio files (omit to accept any type of file)
    }
  },
  methods: {
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message){
      const m = this.messageList.find(m=>m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  }
}
```

For more detailed examples see the demo folder.

## Components

### Launcher

`Launcher` is the only component needed to use vue-beautiful-chat. It will react dynamically to changes in messages. All new messages must be added via a change in props as shown in the example.

#### Props

| prop                        | type   | description |
|-----------------------------|--------|---------------|
| *participants               | [agentProfile] | Represents your product or service's customer service agents. Fields for each agent: id, name, imageUrl|
| *onMessageWasSent           | function(message) | Called when a message is sent with the message object as an argument. |
| *isOpen                     | Boolean | The bool indicating whether or not the chat window should be open. |
| *open                       | Function | The function passed to the component that mutates the above mentioned bool toggle for opening the chat |
| *close                      | Function | The function passed to the component that mutates the above mentioned bool toggle for closing the chat |
| messageList                 | [message] | An array of message objects to be rendered as a conversation. |
| showEmoji                   | Boolean | A bool indicating whether or not to show the emoji button
| showEmojiInText             | Boolean | A bool indicating whether or not to send emoji directly as a message as opposed to inserting them into the user input
| showFile                    | Boolean | A bool indicating whether or not to show the file chooser button
| showTextInput               | Boolean | A bool indicating whether or not to show the text input field
| showDeletion                | Boolean | A bool indicating whether or not to show the edit button for a message
| showConfirmationDeletion    | Boolean | A bool indicating whether or not to show the confirmation text when we remove a message
| confirmationDeletionMessage | String | The message you want to show when confirming the deletion
| showEdition                 | Boolean | A bool indicating whether or not to show the delete button for a message
| showTypingIndicator         | String | A string that can be set to a user's participant.id to show `typing` indicator for them
| showHeader                  | Boolean | A bool indicating whether or not to show the header of chatwindow
| disableUserListToggle       | Boolean | A bool indicating whether or not to allow the user to toggle between message list and participants list
| colors                      | Object | An object containing the specs of the colors used to paint the component. [See here](#faq)
| messageStyling              | Boolean | A bool indicating whether or not to enable `msgdown` support for message formatting in chat. [See here](#faq)
| autoFocus                   | Boolean | A bool indicating whether or not to disable auto focus
| messageMargin               | MessageMargin | An object that contains the margin configuration for the sender, recipient and system messages. [See here](#message-margin-object)
| acceptedFileTypes           | [String] | An array of strings representing the accepted file types for the file input 
| minimize                    | Function | The function that handles the minimize event
| showMinimizeButton          | Boolean | A bool indicating whether or not to show the minimize button (Defaults to `false`)


#### Events

|event | params   | description |
|-----|--------|---------------|
| onType | undefined | Fires when user types on the message input |
| edit | `message` | Fires after user edited message |

#### Slots

##### header

Replacing default header.

```vue
<template v-slot:header>
  🤔 Good chat between {{participants.map(m=>m.name).join(' & ')}}
</template>
```

##### user-avatar

Replacing user avatar.
Params: `message`, `user`

```vue
<template v-slot:user-avatar="{ message, user }">
  <div style="border-radius:50%; color: pink; font-size: 15px; line-height:25px; text-align:center;background: tomato; width: 25px !important; height: 25px !important; min-width: 30px;min-height: 30px;margin: 5px; font-weight:bold" v-if="message.type === 'text' && user && user.name">
    {{user.name.toUpperCase()[0]}}
  </div>
</template>
```

##### text-message-body

Change markdown for text message.
Params: `message`

```vue
<template v-slot:text-message-body="{ message }">
  <small style="background:red" v-if="message.meta">
    {{message.meta}}
  </small>
  {{message.text}}
</template>
```

##### system-message-body

Change markdown for system message.
Params: `message`

```vue
<template v-slot:system-message-body="{ message }">
  [System]: {{message.text}}
</template>
```

### Message Objects

Message objects are rendered differently depending on their type. Currently, only text, emoji and file types are supported. Each message object has an `author` field which can have the value 'me' or the id of the corresponding agent.

```javascript
{
  author: 'support',
  type: 'text',
  id: 1, // or text '1'
  isEdited: false,
  data: {
    text: 'some text',
    meta: '06-16-2019 12:43'
  }
}

{
  author: 'me',
  type: 'emoji',
  id: 1, // or text '1'
  isEdited: false,
  data: {
    code: 'someCode'
  }
}

{
  author: 'me',
  type: 'file',
  id: 1, // or text '1'
  isEdited: false,
  data: {
    file: {
      name: 'file.mp3',
      url: 'https:123.rf/file.mp3'
    }
  }
}
```

#### Quick replies

When sending a message, you can provide a set of sentences that will be displayed in the user chat as quick replies. Adding in the message object a `suggestions` field with the value an array of strings or key-value objects will trigger this functionality. When using objects, each object should have the form `{ 'Displayed text': id }` and only the text will be shown in the chat. The corresponding id will be available in the `onMessageWasSent` callback as `suggestionId`.

```javascript
{
  author: 'support',
  type: 'text',
  id: 1, // or text '1'
  data: {
    text: 'some text',
    meta: '06-16-2019 12:43'
  },
  suggestions: [{ 'Option A': 11 }, { OptionB: 12 }, 'another one']
}
```

### Message Margin Object

When set it's possible to specify the margin for the sender, recipient and system messages.
The object should have the following structure:
```javascript
{
  sender: 'auto',
  recipient: 'auto',
  system: '25px auto'
}
```

The object takes the css margin configuration. If you wish to only change one of the settings, you can omit from the object, for example
```javascript
// Keeps the default margin for the sender and recipient but sets a top and bottom margin of 25px for the system messages
{
  system: '25px auto'
}
```

### FAQ

<details><summary>How to get the demo working?</summary>
<p>

```
git clone git@github.com:sitronik/vue3-beautiful-chat.git
cd vue-beautiful-chat
yarn install  # this installs the package dependencies
yarn watch  # this watches files to continuously compile them
```

Open a new shell in the same folder

```
cd demo
yarn install # this installs the demo dependencies
yarn dev # this starts the dev server at http://localhost:8080
```

</p>
</details>

<details><summary>How can I add a feature or fix a bug?</summary>
<p>

- Fork the repository
- Fix/add your changes
- `yarn build` on the root to have the library compiled with your latest changes
- create a pull request describing what you did
- discuss the changes with the maintainer
- boom! your changes are added to the main repo
- a release is created almost once per week 😉

</p>
</details>

<details><summary>How can I customize the colors?</summary>
<p>

- When initializing the component, pass an object specifying the colors used:

```javascript
let redColors = {
  header: {
    bg: '#D32F2F',
    text: '#fff'
  },
  launcher: {
    bg: '#D32F2F'
  },
  messageList: {
    bg: '#fff'
  },
  sentMessage: {
    bg: '#F44336',
    text: '#fff'
  },
  receivedMessage: {
    bg: '#eaeaea',
    text: '#222222'
  },
  userInput: {
    bg: '#fff',
    text: '#212121'
  }
}
```

```vue
<beautiful-chat
  ...
  :colors="redColors" />
```

This is the red variant. Please check [this file](https://github.com/mattmezza/vue-beautiful-chat/tree/master/demo/src/colors.js) for the list of variants shown in the demo page online.

Please note that you need to pass an Object containing each one of the color properties otherwise the validation will fail.

</p>
</details>
<details><summary>How can I add message formatting?</summary>
<p>

Good news, message formatting is already added for you. You can enable it by setting `messageStyling` to `true` and you will be using the [msgdown](https://github.com/mattmezza/msgdown) library. You can enable/disable the formatting support at any time, or you can let users do it whenever they prefer.

</p>
</details>

# 🤝 Contributing

1. Fork this repository.
2. Create new branch with feature name.
3. Run `npm install` and `npm run dev`.
4. Create your feature.
5. Commit and set commit message with feature name.
6. Push your code to your fork repository.
7. Create pull request. 🙂

# ⭐️ Support

If you like this project, You can support me with starring ⭐ this repository.

Developed with ❤️ and ☕️
