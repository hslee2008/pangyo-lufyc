<template>
  <div style="width: 100%">
    <br />

    <h1 class="text-center">동아리 활동 기록</h1>

    <br />

    <v-list>
      <v-list-item
        v-for="item in list"
        :key="item.name"
        :to="`/activityadmin/home/?clubname=${item.name}`"
        class="my-1"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-img :src="item.image ?? '/PGHS.png'"></v-img>
          </v-avatar>
        </template>

        <v-list-item-title>{{ item.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ item.leader }} · {{ item.coleader }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const list = ref([]);

onMounted(() => {
  const clubRef = dbRef($db, "clubs");
  onValue(clubRef, (snapshot) => (list.value = snapshot.val()));
});
</script>
