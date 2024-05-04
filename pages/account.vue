<template>
  <div style="width: 95%">
    <br />

    <h2 class="text-center">계정 정보</h2>

    <br />

    <v-table class="rounded-lg">
      <thead style="background-color: #87ceeb">
        <tr>
          <th class="text-left">카테고리</th>
          <th class="text-left">정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>계정 정보</td>
          <td>
            {{ type === "teacher" ? "선생님" : "학생" }}
          </td>
        </tr>
        <tr>
          <td>학번</td>
          <td>
            {{ getInfoFromName(account?.displayName).number }}
          </td>
        </tr>
        <tr>
          <td>이름</td>
          <td>
            {{ getInfoFromName(account?.displayName).name }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <br /><br />

    <h2 class="text-center">사이트 알림</h2>
    <br />
    <v-list v-if="notification" bg-color="grey-lighten-3">
      <v-list-item v-for="(notif, i) in notification" :key="i" class="mb-3">
        <p>{{ notif.message }}</p>
        <v-btn
          @click="deleteNotification(i)"
          block
          variant="tonal"
          class="mt-2"
        >
          <v-icon start>mdi-trash-can</v-icon> 지우기
        </v-btn>
      </v-list-item>
    </v-list>
    <div v-else>
      <v-alert class="text-center">사이트 알림이 없습니다.</v-alert>
    </div>

    <br /><br />

    <h2 class="text-center">동아리 알림</h2>
    <br />
    <v-list v-if="notification" bg-color="grey-lighten-3" lines="two">
      <v-list-item v-for="(notif, i) in clubNotification" :key="i" class="mb-3">
        <v-list-item-title>{{ notif.date }} </v-list-item-title>
        <v-list-item-subtitle>{{ notif.message }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <div v-else>
      <v-alert class="text-center">알림이 없습니다.</v-alert>
    </div>

    <br />
    <br />

    <div class="d-flex justify-center">
      <v-btn color="red" @click="logout"> 로그아웃 </v-btn>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();

const router = useRouter();

const account = ref({});
const type = ref("");
const notification = ref({});
const clubNotification = ref([]);

const logout = () => {
  router.push("/");
  $auth.signOut();
};

function deleteNotification(i) {
  const notifRef = dbRef(
    $db,
    `/member/${account.value.displayName}/notification/${i}`
  );
  set(notifRef, null);
}

onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    account.value = user;

    if (user) {
      onValue(dbRef($db, `/everyone/${user.displayName}/type`), (snapshot) => {
        const data = snapshot.val();
        type.value = data;
      });

      onValue(
        dbRef($db, `/member/${user.displayName}/notification`),
        (snapshot) => {
          const data = snapshot.val();
          notification.value = data;
        }
      );

      onValue(dbRef($db, `/member/${user.displayName}/club`), (snapshot) => {
        const data = snapshot.val();
        const clubNotificationRef = dbRef($db, `/clubs/${data}/notification`);
        onValue(clubNotificationRef, (snapshot) => {
          const data = snapshot.val();
          clubNotification.value = data;
        });
      });
    }
  });
});
</script>
