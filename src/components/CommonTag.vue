<template>
  <div class="tags">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name === tag.name ? 'dark' : 'plain'"
      @click="handleMenu(tag)"
      @close="handleClose(tag, index)"
      >{{ tag.label }}
    </el-tag>
  </div>
</template>
<script setup>
import { useAllDataStore } from "../stores";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
const store = useAllDataStore();
const route = useRoute();
const router = useRouter();

//
const tags = computed(() => store.state.tags);
const handleMenu = (tag) => {
  router.push(tag.name);
  store.selectMenu(tag);
};
const handleClose = (tag, index) => {
  store.updateTags(tag);
  //1.如果删除的不是当前所在的页面，直接删除
  if (tag.name !== route.name) {
    return;
  }
  //2.如果是当前所在的页面又分两种情况
  //1>删除的是最后一个标签
  if (index === tags.value.length) {
    store.selectMenu(tags.value[index - 1]);
    router.push(tags.value[index - 1].name);
  }
  //删除当前标签，跳转到右侧标签
  else {
    store.selectMenu(tag.value[index]);
    router.push(tags.value[index].name);
  }
};
</script>
<style scoped lang="less">
.tags {
  margin: 10px 0 0 20px;
}
.el-tag {
  margin-right: 10px;
}
</style>
