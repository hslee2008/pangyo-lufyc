<template>
  <div style="width: 95%">
    <br />

    <h1 class="text-center">동아리 편집</h1>

    <br />

    <v-alert>
      <h2 class="mb-2">동아리 추가하기</h2>

      <br />

      선생님이 동아리를 추가하고 부장과 차장에게 권한을 부여하면, 부장과 차장이
      추가 설정을 합니다.

      <br /><br />

      <p class="text-center">동아리 이름</p>
      <v-text-field
        v-model="newClubInfo.name"
        placeholder="판교고동아리"
        variant="outlined"
      ></v-text-field>

      <p class="text-center">부장/차장 이름</p>
      <div class="d-flex justify-center ga-4">
        <v-text-field
          v-model="newClubInfo.leader"
          placeholder="1930 홍길동"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="newClubInfo.coleader"
          placeholder="1930 홍길동"
          variant="outlined"
        ></v-text-field>
      </div>

      <br />

      <div class="d-flex justify-center">
        <v-btn color="red" @click="add">추가하기</v-btn>
      </div>
    </v-alert>

    <br />

    <v-alert>
      <h2>동아리 리스트</h2>

      <br />

      <v-list style="background-color: transparent">
        <v-list-item v-for="item in list" :key="item.name" class="mb-3">
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.leader }} / {{ item.coleader }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-alert>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const newClubInfo = ref({
  name: "",
  leader: "",
  coleader: "",
});
const list = ref([]);

const add = () => {
  const clubs = dbRef($db, `clubs/${newClubInfo.value.name}`);
  set(clubs, newClubInfo.value);
  newClubInfo.value = {
    name: "",
    leader: "",
    coleader: "",
  };
};

onMounted(() => {
  const clubs = dbRef($db, `clubs/`);
  onValue(clubs, (snapshot) => {
    list.value = snapshot.val();
  });
});
</script>
