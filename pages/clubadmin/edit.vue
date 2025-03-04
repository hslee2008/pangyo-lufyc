<template>
  <div v-if="!loggedIn">
    <v-otp-input v-model="tp" length="5"></v-otp-input>
  </div>
  <div v-else class="mx-4">
    <br />

    <div class="mb-8 py-4 rounded-lg" style="border: 1px solid black">
      <h2 class="text-center mb-4">부장/차장 권한</h2>

      <div class="d-flex justify-center ga-5 mb-3">
        <v-btn
          variant="tonal"
          :to="`/clubadmin/message/?clubname=${clubName}`"
          class="text-blue"
        >
          문의 확인하기
        </v-btn>
        <v-btn
          v-if="!clubInfo.finished"
          variant="tonal"
          color="red"
          @click="end"
        >
          수동 마감하기
        </v-btn>
        <v-btn v-else variant="tonal" color="red" @click="undoEnd">
          마감 풀기
        </v-btn>
      </div>
    </div>

    <div class="pa-4 rounded-lg d-flex justify-center">
      <img
        :src="clubInfo.image ?? '/PGHS.png'"
        draggable="false"
        class="rounded-lg"
        style="width: 300px"
      />
    </div>

    <h1 class="text-center">{{ clubName }}</h1>

    <br />

    <v-textarea
      v-model="clubInfo.description"
      variant="outlined"
      placeholder="동아리 소개글"
    ></v-textarea>

    <div class="d-flex justify-center ga-3">
      <v-text-field
        v-model="clubInfo.acc"
        variant="outlined"
        placeholder="ex) 15"
        class="mt-4"
        label="모집한 동아리원 수"
      ></v-text-field>
      <v-text-field
        v-model="clubInfo.messaged"
        variant="outlined"
        placeholder="ex) 30"
        class="mt-4"
        label="지원한 동아리원 수"
      ></v-text-field>
    </div>

    <div class="d-flex justify-center">
      <v-alert style="display: block; overflow: auto">
        <v-file-input
          accept="image/*"
          label="헤더 이미지 업로드하기"
          variant="underlined"
          @update:model-value="uploadHeader($event)"
        ></v-file-input>

        만일, 이미지를 업로드하지 않는다면, 판교고 로고가 사용될 것입니다.

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
    </div>

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
              :items="['면접', '자기소개서', '없음']"
              variant="outlined"
              class="mt-4"
            ></v-select>
          </td>
        </tr>
        <tr>
          <td>지원 방법</td>
          <td>
            <v-autocomplete
              v-model="clubInfo.howmessage"
              :items="['문자', '대면지원', '카카오톡', '인스타']"
              chips
              closable-chips
              multiple
              variant="outlined"
              class="mt-4"
            ></v-autocomplete>

            <div
              v-if="
                clubInfo.howmessage?.includes('문자') ||
                clubInfo.howmessage?.includes('카카오톡')
              "
            >
              <v-text-field
                v-model="clubInfo.phone"
                variant="outlined"
                placeholder="ex) 010-1234-5678"
                class="mt-4"
                label="전화번호"
              ></v-text-field>
            </div>
            <div v-if="clubInfo.howmessage?.includes('대면지원')">
              <v-text-field
                v-model="clubInfo.location"
                variant="outlined"
                placeholder="ex) 2-4반 16번"
                class="mt-4"
                label="반 이름"
              ></v-text-field>
            </div>
            <div v-if="clubInfo.howmessage?.includes('인스타')">
              <v-text-field
                v-model="clubInfo.insta"
                variant="outlined"
                placeholder="ex) @hsl.dev"
                class="mt-4"
                label="인스타 아이디"
              ></v-text-field>
            </div>
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

    <div class="d-flex justify-center">
      <v-btn color="red" @click="update">업데이트</v-btn>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

const loggedIn = ref(false);
const tp = ref("");
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
  howmessage: "",
  phone: "",
  location: "",
  insta: "",
  poster: "",
  acc: 0,
  messaged: 0,
});
const account = ref({});

const { $auth, $db, $storage } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const clubName = route.query.clubname;

// when tp changed
watch(tp, (v) => {
  if (v === "20255") {
    loggedIn.value = true;
    localStorage.setItem("loggedIn", true);
  }
});

function end() {
  clubInfo.value.finished = true;
  const messageRef = dbRef($db, `clubs/${clubName}`);
  set(messageRef, clubInfo.value);
}

function undoEnd() {
  clubInfo.value.finished = false;
  const messageRef = dbRef($db, `clubs/${clubName}`);
  set(messageRef, clubInfo.value);
}

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
  "기타"
];

onMounted(async () => {
  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  onAuthStateChanged($auth, (user) => {
    account.value = user;
  });

  if (localStorage.getItem("loggedIn")) {
    loggedIn.value = true;
  }
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
