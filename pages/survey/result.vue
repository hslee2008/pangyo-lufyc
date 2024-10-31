<template>
  <div class="club-list-container">
    <br />

    <div class="d-flex justify-center align-center">
      <v-card
        variant="tonal"
        prepend-icon="mdi-clipboard-list"
        title="다른 동아리 평가하기"
        subtitle="동아리 발표회에 참여하세요"
        to="/survey/select"
        width="100%"
      ></v-card>
    </div>

    <br />
    <br />

    <h1 class="text-center">동아리</h1>

    <div class="top-clubs">
      <v-card
        v-for="(item, name) in Object.values(list ?? {}).slice(0, 3)"
        :key="Object.keys(list ?? {})[name]"
        :to="`/survey/view?clubname=${Object.keys(list ?? {})[name]}&place=${
          name + 1
        }`"
        class="club-card top"
        variant="outlined"
        :style="`border-color: ${getColor(name)}`"
      >
        <p
          v-for="item in Object.keys(list ?? {})[name].split(' ')"
          :key="item"
          class="club-name text-h4"
        >
          {{ item }}
        </p>
        <v-rating
          :model-value="roundRating(item.totalAccumulation, item.totalCount)"
          color="amber"
          readonly
          half-increments
          size="small"
          class="rating"
        ></v-rating>
        <v-card-subtitle class="club-info">
          <div>
            <span class="label">등수:</span>
            <span class="value"
              ><mark>{{ name + 1 }}등</mark></span
            >
          </div>
          <div>
            <span class="label">평균 평점:</span>
            <span class="value">{{
              roundRating(item.totalAccumulation, item.totalCount)
            }}</span>
          </div>
          <div>
            <span class="label">설문 수:</span>
            <span class="value">{{ item.totalCount }}</span>
          </div>
        </v-card-subtitle>
      </v-card>
    </div>

    <br /><br />

    <div class="other-clubs">
      <v-card
        v-for="(item, name) in Object.values(list ?? {}).slice(3)"
        :key="Object.keys(list ?? {})[name + 3]"
        :to="`/survey/view?clubname=${
          Object.keys(list ?? {})[name + 3]
        }&place=${name + 4}`"
        class="club-card"
        variant="outlined"
      >
        <p
          v-for="item in Object.keys(list ?? {})[name + 3].split(' ')"
          :key="item"
          class="club-name text-h4"
        >
          {{ item }}
        </p>
        <v-rating
          :model-value="roundRating(item.totalAccumulation, item.totalCount)"
          color="amber"
          readonly
          half-increments
          size="small"
          class="rating"
        ></v-rating>
        <v-card-subtitle class="club-info">
          <div>
            <span class="label">등수:</span>
            <span class="value"
              ><mark>{{ name + 4 }}등</mark></span
            >
          </div>
          <div>
            <span class="label">평균 평점:</span>
            <span class="value">{{
              roundRating(item.totalAccumulation, item.totalCount)
            }}</span>
          </div>
          <div>
            <span class="label">설문 수:</span>
            <span class="value">{{ item.totalCount }}</span>
          </div>
        </v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const { $db, $auth } = useNuxtApp();
const router = useRouter();

const list = ref([]);
const club = ref("");
const account = ref(null);

const fetchData = async () => {
  const clubRef = dbRef($db, "survey");
  const surveyData = await new Promise((resolve) => {
    onValue(clubRef, (snapshot) => resolve(snapshot.val()));
  });

  const clubsRef = dbRef($db, "clubs");
  const clubsData = await new Promise((resolve) => {
    onValue(clubsRef, (snapshot) => resolve(snapshot.val()));
  });

  const sortedEntries = Object.entries(surveyData)
    .sort(([, a], [, b]) => b.totalCount - a.totalCount)
    .sort(([, a], [, b]) => {
      return (
        b.totalAccumulation / b.totalCount - a.totalAccumulation / a.totalCount
      );
    });

  list.value = Object.fromEntries(sortedEntries);
  club.value = clubsData;
};

const getColor = (rank) => {
  if (rank === 0) return "gold";
  if (rank === 1) return "silver";
  if (rank === 2) return "#CD7F32";
  return "transparent";
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.club-list-container {
  width: 100%;
  padding: 16px;
}

h1 {
  font-size: 20px;
  margin-bottom: 20px;
}

.top-clubs,
.other-clubs {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.club-card {
  width: 100%;
  max-width: 300px;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.club-card.top {
  border: 2px solid;
}

.club-card:hover {
  transform: translateY(-5px);
}

.club-image {
  width: 100%;
  height: 140px;
  border-radius: 4px;
}

.club-name {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
}

.rating {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.club-info {
  font-size: 14px;
  text-align: center;
  color: #444;
  margin-top: 8px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.club-info .label {
  display: inline-block;
  font-weight: 600;
  color: #666;
  margin-right: 4px;
}

.club-info .value {
  color: #333;
}

.text-h4 {
  font-size: 30px !important;
}
</style>
