<template>
  <div style="width: 100%">
    <br />

    <h2 class="text-center">동아리 추천</h2>

    <br />

    <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4" grow>
      <v-tab :value="1">MBTI로 추천</v-tab>
      <v-tab :value="2">ChatGPT와 상담</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="mx-5 my-6">
      <v-tabs-window-item :value="1">
        <p>MBTI를 여러 개 선택할 경우, 그 중에 하나라도 해당하면 추천합니다.</p>

        <br />

        <v-autocomplete
          v-model="mbti"
          :items="mbtis"
          chips
          closable-chips
          multiple
          variant="outlined"
        >
          <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props" :text="item.raw.name"></v-chip>
          </template>
        </v-autocomplete>

        <v-row class="d-flex justify-center">
          <v-col
            v-for="item in Object.values(list ?? {}).filter((club) => {
              if (mbti.length > 0) {
                if (!Object.keys(club ?? {}).includes('major')) return false;

                return includesAny(club.major, getSuggestedMajors(mbti));
              } else {
                return true;
              }
            })"
            :key="item.name"
            class="d-flex justify-center"
          >
            <v-card
              :to="`/clubinfo?clubname=${item.name}`"
              width="150"
              elevation="4"
            >
              <div style="background-color: white">
                <v-img
                  :src="item?.image ?? '/PGHS.png'"
                  class="align-end"
                  height="150"
                  cover
                ></v-img>
              </div>

              <h4 class="text-center mt-3">
                <mark>{{ item.name }}</mark>
              </h4>
              <v-card-actions>
                부장: {{ item.leader }} <br />
                차장: {{ item.coleader }}
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2"></v-tabs-window-item>

      <br />
    </v-tabs-window>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();
const list = ref([]);
const tab = ref(1);
const mbti = ref([]);
const mbtis = [
  "INTJ",
  "INTP",
  "INFJ",
  "INFP",
  "ISTJ",
  "ISTP",
  "ISFJ",
  "ISFP",
  "ENTJ",
  "ENTP",
  "ENFJ",
  "ENFP",
  "ESTJ",
  "ESTP",
  "ESFJ",
  "ESFP",
];
const suggestedMajors = {
  기계공학과: ["INTJ", "ISTJ", "ISTP"],
  전기전자공학과: ["INTJ", "ISTJ", "ISTP"],
  화학공학과: ["INTJ", "ISTP"],
  컴퓨터공학과: ["INTJ", "INTP", "ISTP", "ESTP"],
  물리학과: ["INTJ", "INTP", "ISTP"],
  철학과: ["INTP", "INFP"],
  수학과: ["INTP"],
  심리학과: ["INTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISFJ", "ESFJ", "ISFP"],
  경영학과: ["ENTJ", "ENFJ", "ENFP", "ESTJ", "ESTP", "ESFP"],
  정치외교학과: ["ENTJ", "ENTP", "ESTJ"],
  법학과: ["ENTJ", "ISTJ"],
  산업공학과: ["ENTJ", "ESTJ"],
  경제학과: ["ENTJ", "ENTP", "ESTP"],
  경영정보학과: ["ENTP"],
  커뮤니케이션학과: ["ENTP", "ENFJ", "ENFP", "ESFP"],
  사회학과: ["ENTP"],
  사회복지학과: ["INFJ", "ENFJ", "ISFJ", "ESFJ"],
  교육학과: ["INFJ", "ENFJ"],
  윤리교육과: ["INFJ"],
  문예창작학과: ["INFJ", "INFP", "ISFP"],
  영어영문학과: ["INFP", "ENFP", "ESFP"],
  음악과: ["INFP", "ISFP"],
  연극학과: ["ENFP", "ISFP", "ESFP"],
  회계학과: ["ISTJ"],
  행정학과: ["ISTJ", "ESTJ"],
  간호학과: ["ISFJ", "ESFJ"],
  초등교육과: ["ISFJ", "ESFJ"],
  유아교육과: ["ISFJ", "ESFJ"],
  건축공학과: ["ESTJ"],
  체육학과: ["ESTP"],
  관광학과: ["ESTP", "ESFP"],
};
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

function getSuggestedMajors(mbtiList) {
  const majors = Object.entries(suggestedMajors).reduce(
    (acc, [major, mbtiTypes]) => {
      if (mbtiTypes.some((mbti) => mbtiList.includes(mbti))) {
        acc.push(major);
      }
      return acc;
    },
    []
  );
  return majors;
}

function includesAny(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

onMounted(() => {
  const clubRef = dbRef($db, "clubs");
  onValue(clubRef, (snapshot) => (list.value = snapshot.val()));
});
</script>
