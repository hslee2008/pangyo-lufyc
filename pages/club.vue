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

    <v-combobox
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
    </v-combobox>

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
  "간호학과",
  "건설방재공학과",
  "건축학과",
  "건축공학과",
  "게임학과",
  "경영정보학과",
  "경영학과",
  "경제학과",
  "경찰학과",
  "관광학과",
  "교육학과",
  "국어교육과",
  "국어국문학과",
  "군사학과",
  "기계공학과",
  "기독교학과",
  "노어노문학과",
  "농업경제학과",
  "농업자원경제학과",
  "독어독문학과",
  "동물자원학과",
  "문예창작학과",
  "문헌정보학과",
  "문화재보존학과",
  "물리치료학과",
  "물리학과",
  "미술학과",
  "미술교육과",
  "법학과",
  "북한학과",
  "불교학과",
  "불어불문학과",
  "사학과",
  "사회학과",
  "사회복지학과",
  "산업공학과",
  "생명과학과",
  "세무학과",
  "서어서문학과",
  "섬유공학과",
  "소방학과",
  "수산생명의학과",
  "수의학과",
  "수학과",
  "심리학과",
  "식품영양학과",
  "신학과",
  "안전공학과",
  "약학과",
  "언어학과",
  "에너지공학과",
  "연극학과",
  "영상학과",
  "영어영문학과",
  "유아교육과",
  "윤리교육과",
  "의학과",
  "인공지능학과",
  "일반사회교육과",
  "일어일문학과",
  "임상병리학과",
  "임상병리학과",
  "자유전공학부",
  "임상병리학과",
  "제과제빵과",
  "임상병리학과",
  "재료공학과",
  "전기전자공학과",
  "정보보안학과",
  "정보통신공학과",
  "정치외교학과",
  "조경학과",
  "조리과학과",
  "중어중문학과",
  "지리학과",
  "지리교육과",
  "지적학과",
  "철도공학과",
  "철학과",
  "치의학과",
  "치위생학과",
  "커뮤니케이션학과",
  "컴퓨터공학과",
  "통계학과",
  "특성화 학과",
  "특수교육과",
  "한문학과",
  "한약학과",
  "한의학과",
  "항공운항학과",
  "행정학과",
  "화학공학과",
  "화학과",
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
