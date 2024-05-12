<template>
  <div style="width: 95%">
    <br />

    <h1 class="text-center">동아리 편집</h1>

    <br />

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>동아리 추가하기</v-expansion-panel-title>
        <v-expansion-panel-text>
          선생님이 동아리를 추가하고 부장과 차장에게 권한을 부여하면, 부장과
          차장이 추가 설정을 합니다.

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
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>동아리 리스트</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list style="background-color: transparent">
            <v-list-item v-for="item in list" :key="item.name" class="mb-3">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.leader }} · {{ item.coleader }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title>등록한 학생 확인하기</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-tabs v-model="tab" align-tabs="center" grow>
            <v-tab :value="1">사이트에 등록된 학생</v-tab>
            <v-tab :value="2">동아리에 가입한 학생</v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <br />

              <v-text-field
                v-model="search"
                label="학생 검색하기"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>

              <v-list style="background-color: transparent">
                <v-list-item
                  v-for="stu in Object.values(students).filter((a) =>
                    a.name.includes(search)
                  )"
                  :key="stu.name"
                >
                  {{ stu.name }}
                </v-list-item>
              </v-list>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <br />

              <v-text-field
                v-model="search"
                label="학생 검색하기"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>

              <v-list style="background-color: transparent">
                <div
                  v-for="stu in Object.values(students).filter((a) =>
                    a.name.includes(search)
                  )"
                >
                  <v-list-item v-if="stu.approved" :key="stu.name">
                    {{ stu.name }}
                  </v-list-item>
                </div>
              </v-list>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
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

const tab = ref(1);

const students = ref([]);
const search = ref("");

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

  const studentsRef = dbRef($db, `member/`);
  onValue(studentsRef, (snapshot) => {
    students.value = snapshot.val();
  });
});
</script>
