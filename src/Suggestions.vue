<template>
  <div class="sc-suggestions-row" :style="{background: colors.messageList.bg}">
    <button
      v-for="(suggestion, idx) in normalizedSuggestions"
      :key="idx"
      class="sc-suggestions-element"
      :style="{
        borderColor: colors.sentMessage.bg,
        color: colors.sentMessage.bg
      }"
      @click="$emit('sendSuggestion', suggestion)"
    >
      {{ suggestion.text }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Object,
      required: true
    }
  },
  computed: {
    normalizedSuggestions() {
      return this.suggestions.map((s) => {
        if (typeof s === 'string') {
          return {text: s}
        } else if (s && typeof s === 'object') {
          const key = Object.keys(s)[0]
          return {text: key, id: s[key]}
        }
        return {text: ''}
      })
    }
  }
}
</script>

<style>
.sc-suggestions-row {
  text-align: center;
  background: inherit;
}

.sc-suggestions-element {
  margin: 3px;
  padding: 5px 10px 5px 10px;
  border: 1px solid;
  border-radius: 15px;
  font-size: 14px;
  background: inherit;
  cursor: pointer;
}
</style>
