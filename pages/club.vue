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
      <v-checkbox
        v-model="onlySeeCanJoin"
        label="모집 중인 동아리만 보기"
      ></v-checkbox>
      <v-checkbox
        v-model="onlySeeExistInfo"
        label="정보 등록된 동아리만 보기"
      ></v-checkbox>
    </div>

    <v-radio-group v-model="std">
      <v-radio value="popular" label="지원자 수 많은 동아리"></v-radio>
      <v-radio value="lesscompetitive" label="경쟁률 낮은 동아리"></v-radio>
    </v-radio-group>

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
            if (onlySeeExistInfo) {
              return Object.keys(a).length > 3;
            } else {
              return true;
            }
          })
          .filter((a) => {
            if (!searchByMajor.length) return true;
            if (searchByMajor) {
              if (!Object.keys(a).includes('major')) return false;
              if (searchByMajor.some((r) => a.major.includes(r))) return true;
            }
          })
          .filter((a) => {
            if (a.name.includes(searchByName)) return true;
          })"
        :key="item.name"
        class="d-flex justify-center"
      >
        <v-card :to="`/clubinfo?clubname=${item.name}`" width="150">
          <v-img
            :src="
              item?.image ??
              'https://firebasestorage.googleapis.com/v0/b/thinkforall-linkall.appspot.com/o/school%2FPGHS.png?alt=media&token=1a077cc3-d8f0-4994-8d62-09d68ef49739'
            "
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="150"
            cover
          ></v-img>

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
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const list = ref([]);
const std = ref("popular");

const onlySeeCanJoin = ref(false);
const onlySeeExistInfo = ref(false);

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
