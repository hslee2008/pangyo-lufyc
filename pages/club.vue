<template>
  <div style="width: 100%" class="mx-4">
    <br />

    <h1 class="text-center">동아리</h1>

    <br />

    <v-text-field
      v-model="searchByName"
      label="동아리 이름으로 검색하기"
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>

    <v-autocomplete
      v-model="searchByMajor"
      :items="majors"
      chips
      closable-chips
      multiple
      variant="outlined"
      label="학과로 동아리 검색하기"
    >
      <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" :text="item.raw.name"></v-chip>
      </template>
    </v-autocomplete>

    <div class="d-flex ga-3">
      <v-checkbox v-model="onlybelt" label="벨트 동아리만 보기"></v-checkbox>
      <v-checkbox v-model="onlyteacher" label="교사주도 동아리만 보기"></v-checkbox>
    </div>

    <br />

    <v-row class="d-flex justify-center">
      <v-col
        v-for="item in Object.values(list ?? {})
          .sort((a, b) => {
            if (std === 'popular') {
              return (
                Object.keys(b?.joining ?? {}).length -
                Object.keys(a?.joining ?? {}).length
              );
            } else if (std === 'lesscompetitive') {
              return (
                Object.keys(a?.joining ?? {}).length / a.memberNumber -
                Object.keys(b?.joining ?? {}).length / b.memberNumber
              );
            }
          })
          .filter((a) => {
            if (onlySeeCanJoin) {
              const today = new Date();
              const endDate = new Date(a.end);
              endDate.setDate(endDate.getDate() + 1);

              return today <= endDate;
            } else {
              return true;
            }
          })
          .filter((a) => {
            if (onlybelt) {
              return a.type === 'belt';
            } else {
              return true;
            }
          })
          .filter((a) => {
            if (onlyteacher) {
              return a.type === 'teacher';
            } else {
              return true;
            }
          })
          .filter((a) => {
            if (!searchByMajor.length) return true;
            if (searchByMajor) {
              if (!Object.keys(a)?.includes('major')) return false;
              if (searchByMajor.some((r) => a.major?.includes(r))) return true;
            }
          })
          .filter((a) => {
            if (a.name?.includes(searchByName)) return true;
          })"
        :key="item.name"
        class="d-flex justify-center"
      >
        <v-card
          :to="`/clubinfo?clubname=${item.name}`"
          :class="`club-card ${
            item.type === 'belt'
              ? 'gold-card'
              : item.type === 'teacher'
              ? 'green-card'
              : ''
          }`"
          elevation="4"
        >
          <v-img
            :src="item?.image || item?.poster || '/PGHS.png'"
            class="club-card-image"
            height="150"
            cover
          ></v-img>

          <p class="club-card-title mb-3" style="font-size: 15px">
            {{ item.name }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const list = ref([]);
const std = ref("popular");

const onlySeeCanJoin = ref(false);
const onlySeeExistInfo = ref(false);

const onlybelt = ref(false);
const onlyteacher = ref(false);

const searchByName = ref("");
const searchByMajor = ref([]);
const majors = [
  "물리학",
  "화학",
  "생명과학",
  "지구과학",
  "수학",
  "정보과학",
  "공학",
  "의학",
  "농학",
  "인문학",
  "사회과학",
  "예체능",
  "교육학",
  "법학",
  "경제학",
  "기타",
];

onMounted(() => {
  const clubRef = dbRef($db, "clubs");
  onValue(clubRef, (snapshot) => (list.value = snapshot.val()));
});
</script>

<style>
.club-card {
  width: 150px;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.club-card-image {
  background-color: white;
}

.club-card-title {
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
}

.club-card-title mark {
  background-color: yellow;
  padding: 2px 4px;
  border-radius: 4px;
}

.club-card-text {
  padding: 8px;
  text-align: center;
  font-size: 14px;
}

.gold-card {
  border: 5px solid gold !important;
}

.green-card {
  border: 5px solid green !important;
}
</style>
