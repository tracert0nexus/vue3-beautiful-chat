<template>
  <div :style="{background: backgroundColor}">
    <beautiful-chat
      :always-scroll-to-bottom="alwaysScrollToBottom"
      :close="closeChat"
      :colors="colors"
      :is-open="isChatOpen"
      :message-list="messageList"
      :message-styling="messageStyling"
      :new-messages-count="newMessagesCount"
      :on-message-was-sent="onMessageWasSent"
      :open="openChat"
      :participants="participants"
      :show-close-button="true"
      :show-text-input="showTextInput"
      :show-typing-indicator="showTypingIndicator"
      :disable-user-list-toggle="false"
      @onType="handleOnType"
      @edit="editMessage"
      @remove="removeMessage"
    >
      <template v-slot:header>
        Unisport Sekretariat
      </template>
      <template v-slot:text-message-body="scopedProps">
        <p class="sc-message--text-content" v-html="scopedProps.messageText"></p>
        <p
          v-if="scopedProps.message.data.meta"
          class="sc-message--meta"
          :style="{color: scopedProps.messageColors.color}"
        >
          {{ scopedProps.message.data.meta }}
        </p>
      </template>
      <template v-slot:system-message-body="{message}"> [System]: {{ message.text }} </template>
    </beautiful-chat>
    <TestArea
      :chosen-color="chosenColor"
      :colors="colors"
      :message-styling="messageStyling"
      :on-message="sendMessage"
      :on-typing="handleTyping"
    />
  </div>
</template>

<script>
import messageHistory from './messageHistory'
import chatParticipants from './chatProfiles'
import TestArea from './TestArea.vue'
import availableColors from './colors'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    TestArea
  },
  data() {
    return {
      participants: chatParticipants,
      messageList: messageHistory,
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: '',
      colors: null,
      availableColors,
      chosenColor: null,
      alwaysScrollToBottom: true,
      messageStyling: true,
      userIsTyping: false,
      showTextInput: false
    }
  },
  computed: {
    linkColor() {
      return this.chosenColor === 'dark' ? this.colors.sentMessage.text : this.colors.launcher.bg
    },
    backgroundColor() {
      return this.chosenColor === 'dark' ? this.colors.messageList.bg : '#fff'
    }
  },
  created() {
    this.setColor('red')
  },
  mounted() {
    this.messageList.forEach((x) => (x.liked = false))
  },
  methods: {
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({
          author: 'support',
          type: 'text',
          id: Math.random(),
          data: {text}
        })
      }
    },
    handleTyping(text) {
      this.showTypingIndicator =
        text.length > 0 ? this.participants[this.participants.length - 1].id : ''
    },
    async onMessageWasSent(message) {
      // 1) User-Nachricht anhängen
      const makeId = () => Math.floor(Math.random() * 1e9);
      const userMsg = { ...message, id: message.id ?? makeId() };
      this.messageList = [...this.messageList, userMsg];

      console.log("Selected Option-ID:", message.suggestionId);

      // 2) Falls eine Suggestion gewählt wurde → API fragen & Antwort anhängen
      if (message.suggestionId) {
        try {
          const { data } = await axios.post(
              'http://localhost:82/index.php/api/ask',
              { id: message.suggestionId }
          );

          // API liefert ein Array von Messages -> direkt anhängen
          const botMessages = (Array.isArray(data) ? data : [data]).map(m => ({
            ...m,
            id: m.id ?? makeId() // falls Backend keine id setzt
          }));

          this.messageList = [...this.messageList, ...botMessages];

          // 3) Texteingabe nur anzeigen, wenn keine Suggestions mehr vorliegen
          const last = botMessages[botMessages.length - 1] || {};
          this.showTextInput = !(Array.isArray(last.suggestions) && last.suggestions.length > 0);
        } catch (err) {
          console.error(err);
          // Optional: Fehler als System-Hinweis anhängen
          this.messageList = [
            ...this.messageList,
            {
              type: 'text',
              author: 'system',
              id: makeId(),
              data: { text: 'Konnte die Antwort nicht laden. Bitte wende dich an it.sport@unibe.ch' },
              suggestions: []
            }
          ];
          this.showTextInput = true;
        }
      } else {
        // Freitextfall
        this.showTextInput = true;
      }
    },
    openChat() {
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat() {
      this.isChatOpen = false
    },
    setColor(color = 'red') {
      this.colors = this.availableColors[color]
      this.chosenColor = color
    },
    showStylingInfo() {
      alert(
        'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
      )
      // this.$modal.show('dialog', {
      //   title: 'Info',
      //   text:
      //     'You can use *word* to <strong>boldify</strong>, /word/ to <em>emphasize</em>, _word_ to <u>underline</u>, `code` to <code>write = code;</code>, ~this~ to <del>delete</del> and ^sup^ or ¡sub¡ to write <sup>sup</sup> and <sub>sub</sub>'
      // })
    },
    messageStylingToggled(e) {
      this.messageStyling = e.target.checked
    },
    handleOnType(e) {
      this.$event.$emit('onType', e)
      this.userIsTyping = true
    },
    editMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id)
      m.isEdited = true
      m.data.text = message.data.text
    },
    removeMessage(message) {
      const m = this.messageList.find((m) => m.id === message.id)
      m.type = 'system'
      m.data.text = 'This message has been removed'
    },
    like(id) {
      const m = this.messageList.findIndex((m) => m.id === id)
      var msg = this.messageList[m]
      msg.liked = !msg.liked
      this.messageList[m] = msg
    }
  }
}
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
}

* {
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
}

.demo-description {
  max-width: 500px;
}

.demo-description img {
  max-width: 500px;
}

.demo-test-area {
  width: 300px;
  box-sizing: border-box;
}

.demo-test-area--text {
  box-sizing: border-box;
  width: 100%;
  margin: 0px;
  padding: 0px;
  resize: none;
  font-family: Avenir Next, Helvetica Neue, Helvetica, sans-serif;
  background: #fafbfc;
  color: #8da2b5;
  border: 1px solid #dde5ed;
  font-size: 16px;
  padding: 16px 15px 14px;
  margin: 0;
  border-radius: 6px;
  outline: none;
  height: 150px;
  margin-bottom: 10px;
}

.demo-monster-img {
  width: 400px;
  display: block;
  margin: 60px auto;
}

.text-center {
  text-align: left;
}

.colors a {
  color: #fff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 10px;
}

.toggle a {
  text-decoration: none;
}

.messageStyling {
  font-size: small;
}
</style>
