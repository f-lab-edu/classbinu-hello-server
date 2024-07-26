import { check, sleep } from 'k6';

import http from 'k6/http';

const BASE_URL = 'http://127.0.0.1:3000';
// const BASE_URL = 'http://43.201.247.115';

export const options = {
  vus: 70,
  duration: '30s',
};

export default function () {
  // Post GET
  let response = http.get(`${BASE_URL}/posts/1`);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  if (response.status !== 200) {
    console.error(`❌ Request failed ${response.body}`);
  }
  sleep(0.1);

  // // Auth Login Post
  // let postPayload = JSON.stringify({
  //   username: 'test',
  //   password: '1234',
  // });
  // let postParams = { headers: { 'Content-Type': 'application/json' } };
  // let postResponse = http.post(
  //   `${BASE_URL}/auth/login`,
  //   postPayload,
  //   postParams,
  // );
  // check(postResponse, {
  //   'status is 201': (r) => r.status === 201,
  // });
  // if (postResponse.status !== 201) {
  //   console.error(`❌ Request failed ${postResponse.body}`);
  // }
  // sleep(0.01);

  // // // Post Patch
  // let patchPayload = JSON.stringify({
  //   title: 'foo',
  //   content: 'bar',
  // });
  // const patchHeaders = {
  //   headers: {
  //     Authorization:
  //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTcyMTkxMzcyOCwiZXhwIjoxNzUzNDQ5NzI4fQ.m3hw9LlVjBAXi2WRmzn450EaBIQi167n323j6pQxY0A',
  //     'Content-Type': 'application/json',
  //   },
  // };
  // let patchResponse = http.patch(
  //   `${BASE_URL}/posts/1`,
  //   patchPayload,
  //   patchHeaders,
  // );
  // check(patchResponse, {
  //   'status is 200': (r) => r.status === 200,
  // });
  // if (patchResponse.status !== 200) {
  //   console.error(`❌ Request failed ${patchResponse.body}`);
  // }
  // sleep(0.1);
}
