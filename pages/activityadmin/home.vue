<template>
  <div style="width: 100%" class="mx-4">
    <br />

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} ·
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <div class="d-flex justify-center">
          <v-btn
            v-bind="activatorProps"
            color="surface-variant"
            text="동아리원으로서 글쓰기"
            prepend-icon="mdi-pencil"
            variant="outlined"
            class="mb-3"
          ></v-btn>
        </div>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card :title="`활동 기록하기`">
          <v-card-text>
            <v-text-field
              v-model="newActivity.writer"
              label="동아리원 이름"
              variant="outlined"
            ></v-text-field>
            <v-select
              v-model="newActivity.date"
              :items="dates"
              variant="outlined"
            ></v-select>
            <v-textarea
              v-model="newActivity.content"
              variant="outlined"
            ></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="등록하기"
              color="primary"
              @click="update(isActive)"
            ></v-btn>
            <v-btn
              text="취소하기"
              color="error"
              @click="isActive.value = false"
            ></v-btn>

            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <div class="d-flex justify-center">
          <v-btn
            v-if="
              account.displayName === clubInfo.leader.replaceAll(' ', '') ||
              account.displayName === clubInfo.coleader.replaceAll(' ', '')
            "
            v-bind="activatorProps"
            color="surface-variant"
            text="부장/차장으로서 글쓰기"
            prepend-icon="mdi-pencil"
            variant="outlined"
          ></v-btn>
        </div>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card :title="`활동 기록하기`">
          <v-card-text>
            <v-select
              v-model="newActivity.writer"
              :items="['부장', '차장']"
              variant="outlined"
            ></v-select>
            <v-select
              v-model="newActivity.date"
              :items="dates"
              variant="outlined"
            ></v-select>
            <v-textarea
              v-model="newActivity.content"
              variant="outlined"
            ></v-textarea>
            <v-file-input
              label="동아리 사진 업로드 (여러 개)"
              chips
              multiple
              variant="outlined"
              @update:model-value="upload($event)"
            ></v-file-input>

            <div class="d-flex ga-4">
              <v-img
                v-for="(image, i) in newActivity.images"
                :key="i"
                :src="image"
              >
              </v-img>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="등록하기"
              color="primary"
              @click="update(isActive)"
            ></v-btn>
            <v-btn
              text="취소하기"
              color="error"
              @click="isActive.value = false"
            ></v-btn>

            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <br />

    <v-alert v-if="!activities">
      <v-empty-state
        icon="mdi-information-off"
        text="아직까지 동아리 부장 또는 차장이 동아리 활동 글을 올리지 않았기 때문에 볼 수 없습니다."
        title="동아리 활동 글이 아직 없습니다."
      ></v-empty-state>
    </v-alert>
    <v-table v-else>
      <thead>
        <tr style="background-color: skyblue">
          <th
            v-if="
              account.displayName === clubInfo.leader.replaceAll(' ', '') ||
              account.displayName === clubInfo.coleader.replaceAll(' ', '')
            "
            class="text-center"
          >
            권한
          </th>
          <th class="text-center">열기</th>
          <th class="text-center">날짜</th>
          <th class="text-center">글쓴이</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(activity, date) in activities" :key="date">
          <tr v-for="(item, writer) in activity" :key="writer">
            <td
              class="text-center"
              v-if="
                account.displayName === clubInfo.leader.replaceAll(' ', '') ||
                account.displayName === clubInfo.coleader.replaceAll(' ', '')
              "
            >
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    icon="mdi-delete"
                    variant="plain"
                    color="error"
                  ></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card title="진짜로 삭제할 것인가요?">
                    <v-card-text>
                      글을 삭제하면 다시 복구하는 것은 불가능합니다.
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="삭제하기"
                        color="red"
                        @click="deletePost(date, writer, isActive)"
                      ></v-btn>
                      <v-btn
                        text="취소하기"
                        @click="isActive.value = false"
                      ></v-btn>

                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="text-center">
              <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn v-bind="activatorProps" variant="tonal"> 열기 </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card :title="`활동 기록 ${item.date}`">
                    <v-card-text>
                      <div v-if="!edit">
                        {{ item.content }}

                        <br /><br />

                        <v-row class="ga-4 justify-center">
                          <v-img
                            v-for="image in item.images"
                            :key="image"
                            :src="image"
                            class="my-2 rounded-lg"
                            style="max-width: 150px"
                          ></v-img>
                        </v-row>
                      </div>
                      <div v-else>
                        <v-textarea
                          v-model="activities[date][writer].content"
                          variant="outlined"
                        ></v-textarea>

                        <div v-if="item.images">
                          <v-alert>이미지는 수정할 수 없습니다.</v-alert>
                        </div>
                      </div>

                      <br /><br />

                      <v-btn
                        v-if="edit"
                        color="primary"
                        variant="tonal"
                        block
                        @click="editActivity"
                      >
                        업데이트
                      </v-btn>
                      <v-btn
                        v-if="!edit"
                        color="primary"
                        variant="tonal"
                        block
                        @click="edit = true"
                      >
                        <v-icon start>mdi-pencil</v-icon> 수정하기
                      </v-btn>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="닫기"
                        color="error"
                        block
                        @click="isActive.value = false"
                      ></v-btn>

                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="text-center">{{ date.replaceAll("_", "/") }}</td>
            <td class="text-center">{{ writer }}</td>
          </tr>
        </template>
      </tbody>
    </v-table>
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
const newActivity = ref({
  writer: "",
  content: "",
  images: [],
  date: "",
});
const activities = ref([]);
const account = ref({});
const edit = ref(false);

const { $auth, $db, $storage } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const clubName = route.query.clubname;

const dates = [
  "3/22",
  "4/5",
  "5/10",
  "5/24",
  "6/21",
  "7/12",
  "8/30",
  "9/06",
  "9/13",
  "9/27",
  "10/25",
  "11/01",
  "11/15",
];

onMounted(async () => {
  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  const activityRef = dbRef($db, `activity/${clubName}`);
  await onValue(activityRef, (snapshot) => (activities.value = snapshot.val()));

  onAuthStateChanged($auth, (user) => {
    account.value = user;
  });
});

const update = (isActive) => {
  const clubRef = dbRef(
    $db,
    `/activity/${clubName}/${newActivity.value.date.replaceAll("/", "_")}/${
      newActivity.value.writer
    }`
  );
  set(clubRef, newActivity.value);
  isActive.value = false;
  newActivity.value = {
    writer: "",
    content: "",
    images: [],
    date: "",
  };
};

const editActivity = () => {
  const activityRef = dbRef($db, `/activity/${clubName}`);
  set(activityRef, activities.value);

  edit.value = false;
};

const upload = (f) => {
  console.log(f);

  f.forEach((i) => {
    const storageRef = sRef($storage, `activity/${clubName}/${i.name}`);

    uploadBytes(storageRef, i).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        newActivity.value.images.push(downloadURL);
      });
    });
  });
};

function deletePost(date, writer, isActive) {
  delete activities.value[date][writer];
  const activityRef = dbRef($db, `/activity/${clubName}`);
  set(activityRef, activities.value);
  isActive.value = false;
}
</script>
