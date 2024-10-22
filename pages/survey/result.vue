<template>
  <div style="width: 100%" class="mx-4">
    <br />

    <h1 class="text-center">동아리</h1>

    <br />

    <div class="d-flex justify-center align-center flex-column">
      <v-card
        v-for="(item, name) in Object.values(list ?? {}).slice(0, 3)"
        :key="Object.keys(list ?? {})[name]"
        :to="`/survey/view?clubname=${Object.keys(list ?? {})[name]}&place=${
          name + 1
        }`"
        elevation="4"
        :width="name <= 2 ? 200 : 150"
        :style="`${name <= 2 ? 'outline: 5px solid;' : ''} ${
          name === 0 ? 'outline-color: gold;' : ''
        } ${name === 1 ? 'outline-color: silver;' : ''} ${
          name === 2 ? 'outline-color: #CD7F32;' : ''
        } ${name === 2 ? 'margin-bottom: 70px;' : 'margin-bottom: 30px;'}`"
      >
        <v-card width="250" height="100">
          <v-img
            :src="
              club[Object.keys(list ?? {})[name]]?.image ??
              'https://seongnam.grandculture.net/Image?localName=seongnam&id=GC001P3593&t=middle'
            "
            cover
          ></v-img>
        </v-card>
        <div class="d-flex justify-center" v-if="name <= 2">
          <v-rating
            :model-value="roundRating(item.totalAccumulation, item.totalCount)"
            color="amber"
            readonly
            half-increments
            size="small"
          ></v-rating>
        </div>
        <v-card-title class="text-center">
          {{ Object.keys(list ?? {})[name] }}
        </v-card-title>
        <v-card-text class="club-card-text mb-4">
          <v-card-subtitle class="text-left">
            등수: {{ name + 1 }}위<br />
            평점
            {{ roundRating(item.totalAccumulation, item.totalCount) }}<br />
            설문 수: {{ item.totalCount }}
          </v-card-subtitle>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-center align-center">
        <v-row class="d-flex justify-center align-center">
          <v-col
            v-for="(item, name) in Object.values(list ?? {}).slice(
              3,
              Object.values(list ?? {}).length
            )"
            :key="
              Object.keys(list ?? {}).slice(
                3,
                Object.values(list ?? {}).length
              )[name]
            "
            sm="4"
          >
            <v-card
              :to="`/survey/view?clubname=${
                Object.keys(list ?? {}).slice(
                  3,
                  Object.values(list ?? {}).length
                )[name]
              }&place=${name + 4}`"
              elevation="4"
              width="200"
            >
              <v-card width="250" height="100">
                <v-img
                  :src="
                    club[
                      Object.keys(list ?? {}).slice(
                        3,
                        Object.values(list ?? {}).length
                      )[name]
                    ]?.image ??
                    'https://seongnam.grandculture.net/Image?localName=seongnam&id=GC001P3593&t=middle'
                  "
                  cover
                ></v-img>
              </v-card>
              <div class="d-flex justify-center" v-if="name <= 2">
                <v-rating
                  :model-value="
                    roundRating(item.totalAccumulation, item.totalCount)
                  "
                  color="amber"
                  readonly
                  half-increments
                  size="small"
                ></v-rating>
              </div>
              <v-card-title class="text-center">
                {{
                  Object.keys(list ?? {}).slice(
                    3,
                    Object.values(list ?? {}).length
                  )[name]
                }}
              </v-card-title>
              <v-card-text class="club-card-text mb-4">
                <v-card-subtitle class="text-left">
                  등수: {{ name + 4 }}위<br />
                  평점
                  {{ roundRating(item.totalAccumulation, item.totalCount)
                  }}<br />
                  설문 수: {{ item.totalCount }}
                </v-card-subtitle>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const { $db } = useNuxtApp();

const list = ref([]);
const club = ref("");

const fetchData = async () => {
  try {
    // Fetch data for survey
    const clubRef = dbRef($db, "survey");
    const surveyData = await new Promise((resolve) => {
      onValue(clubRef, (snapshot) => resolve(snapshot.val()));
    });

    // Fetch data for clubs
    const clubsRef = dbRef($db, "clubs");
    const clubsData = await new Promise((resolve) => {
      onValue(clubsRef, (snapshot) => resolve(snapshot.val()));
    });

    // Sort survey data by totalAccumulation in descending order
    const sortedEntries = Object.entries(surveyData).sort(([, a], [, b]) => {
      return (
        b.totalAccumulation / b.totalCount - a.totalAccumulation / a.totalCount
      );
    });

    // Set the sorted list and clubs data
    list.value = Object.fromEntries(sortedEntries);
    club.value = clubsData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchData(); // Call async function to fetch data
});
</script>

<style>
.club-card {
  width: 250px;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.club-card-text {
  padding: 8px;
  text-align: center;
  font-size: 14px;
}
</style>
