<template>
  <div class="mx-4">
    <br />

    <div class="pa-4 rounded-lg d-flex justify-center">
      <img
        :src="
          clubInfo.image ??
          'https://firebasestorage.googleapis.com/v0/b/thinkforall-linkall.appspot.com/o/school%2FPGHS.png?alt=media&token=1a077cc3-d8f0-4994-8d62-09d68ef49739'
        "
        draggable="false"
        class="rounded-lg"
        style="width: 300px"
      />
    </div>
    
    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <v-textarea
      v-model="clubInfo.description"
      variant="outlined"
      placeholder="동아리 소개글"
    ></v-textarea>

    <v-alert>
      <v-file-input
        accept="image/*"
        label="헤더 이미지 업로드하기"
        variant="underlined"
        @update:model-value="uploadHeader($event)"
      ></v-file-input>

      만일, 이미지를 업로드하지 않는다면, 판교고 로고를 사용할 것입니다.

      <v-img :src="clubInfo.image" class="rounded-lg mt-3"></v-img>
    </v-alert>
    <br />
    <v-alert>
      <v-file-input
        accept="image/*"
        label="포스터 이미지로 업로드하기"
        variant="underlined"
        @update:model-value="uploadPoster($event)"
      ></v-file-input>

      <v-img :src="clubInfo.poster" class="rounded-lg"></v-img>
    </v-alert>

    <br />

    <v-table style="border: 1px solid black" class="rounded-lg">
      <thead>
        <tr style="background-color: skyblue">
          <th class="text-left">카테고리</th>
          <th class="text-left">정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>관련 학과</td>
          <td>
            <v-autocomplete
              v-model="clubInfo.major"
              :items="majors"
              chips
              closable-chips
              multiple
              variant="outlined"
              class="mt-4"
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :text="item.raw.name"></v-chip>
              </template>
            </v-autocomplete>
          </td>
        </tr>
        <tr>
          <td>최대 모집 인원 수</td>
          <td>
            <v-text-field
              v-model="clubInfo.memberNumber"
              variant="outlined"
              class="mt-4"
            ></v-text-field>
          </td>
        </tr>
        <tr>
          <td>모집 방법</td>
          <td>
            <v-select
              v-model="clubInfo.how"
              :items="['면접', '자기소개서', '필기시험']"
              variant="outlined"
              class="mt-4"
            ></v-select>
          </td>
        </tr>
        <tr>
          <td>모집 시기</td>
          <td>
            <v-text-field
              v-model="clubInfo.start"
              variant="outlined"
              placeholder="2024-05-01와 같은 형식으로"
              class="mt-4"
              label="시기"
            ></v-text-field>
            <v-text-field
              v-model="clubInfo.end"
              variant="outlined"
              placeholder="2024-05-16와 같은 형식으로"
              class="mt-4"
              label="종기"
            ></v-text-field>
          </td>
        </tr>
      </tbody>
    </v-table>

    <br />

    <div>
      <h2>신청하기 관련 설정</h2>
      <br />
      <v-checkbox
        v-model="clubInfo.getWhyJoined"
        label="신청할 때 지원 동기 받기"
      ></v-checkbox>
    </div>

    <br />

    <div class="d-flex justify-center">
      <v-btn color="red" @click="update">업데이트</v-btn>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const clubInfo = ref({
  leader: "",
  coleader: "",
  description: "",
  image: "",
  major: "",
  memberNumber: 20,
  how: "면접",
  start: "2024-05-01",
  end: "2024-05-16",
  getWhyJoined: false,
});
const account = ref({});

const { $auth, $db, $storage } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const clubName = route.query.clubname;

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

onMounted(async () => {
  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  onAuthStateChanged($auth, (user) => {
    account.value = user;
  });
});

const update = () => {
  const clubRef = dbRef($db, `/clubs/${clubName}`);
  set(clubRef, clubInfo.value);
  router.push(`/clubinfo?clubname=${clubName}`);
};

const uploadHeader = (f) => {
  console.log(f);
  const storageRef = sRef($storage, `logos/${clubName}`);

  uploadBytes(storageRef, f).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      clubInfo.value.image = downloadURL;
    });
  });
};
const uploadPoster = (f) => {
  console.log(f);
  const storageRef = sRef($storage, `poster/${clubName}`);

  uploadBytes(storageRef, f).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      clubInfo.value.poster = downloadURL;
    });
  });
};
</script>
