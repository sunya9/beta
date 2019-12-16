<template>
  <dl class="row">
    <template v-for="keySet in keySets">
      <dt :key="`${keySet.label}-dt`" class="col-4">
        <template v-if="keySet.key.includes('+')">
          <kbd>
            <template v-for="(key, i) in keySet.key.split('+')">
              <template v-if="i">
                +
              </template>
              <kbd :key="key">
                {{ key }}
              </kbd>
            </template>
          </kbd>
        </template>
        <template v-else-if="typeof keySet.key === 'object'">
          <template v-for="(key, i) in keySet.key">
            <template v-if="i">
              &nbsp;
            </template>
            <kbd :key="`${key}-${i}`">
              {{ key }}
            </kbd>
          </template>
        </template>
        <template v-else>
          <kbd>{{ keySet.key }}</kbd>
        </template>
      </dt>
      <dd :key="`${keySet.label}-dd`" class="col-8">
        {{ keySet.label }}
      </dd>
    </template>
  </dl>
</template>
<script lang="ts">
import Vue from 'vue'

type KeyObj = { label: string; key: string }
export default Vue.extend({
  props: {
    keySets: {
      type: Array,
      required: true,
      // TODO
      validator: (keys: KeyObj[]) =>
        keys.every(
          (keyObj: any) =>
            'label' in keyObj &&
            typeof keyObj.label === 'string' &&
            'key' in keyObj &&
            (typeof keyObj.key === 'string' ||
              (typeof keyObj.key === 'object' &&
                keyObj.key.every((k: any) => typeof k === 'string')))
        )
    }
  }
})
</script>
