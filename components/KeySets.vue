<template>
  <dl class="row">
    <template v-for="keySet in keySets">
      <dt class="col-4" :key="`${keySet.label}-dt`">
        <template v-if="keySet.key.includes('+')">
          <kbd>
            <template v-for="(key, i) in keySet.key.split('+')">
              <template v-if="i">+</template>
              <kbd :key="key">{{key}}</kbd>
            </template>
          </kbd>
        </template>
        <template v-else-if="typeof keySet.key === 'object'">
          <template v-for="(key, i) in keySet.key">
            <template v-if="i">&nbsp;</template>
            <kbd :key="`${key}-${i}`">{{key}}</kbd>
          </template>
        </template>
        <template v-else>
          <kbd>{{keySet.key}}</kbd>
        </template>
      </dt>
      <dd class="col-8" :key="`${keySet.label}-dd`">
        {{keySet.label}}
      </dd>
    </template>
  </dl>
</template>
<script>
export default {
  props: {
    keySets: {
      type: Array,
      required: true,
      validator: keys =>
        keys.every(
          keyObj =>
            'label' in keyObj &&
            typeof keyObj.label === 'string' &&
            'key' in keyObj &&
            (typeof keyObj.key === 'string' ||
              (typeof keyObj.key === 'object' &&
                keyObj.key.every(k => typeof k === 'string')))
        )
    }
  }
}
</script>
