export type Landmark = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  provinceId: string;
};

export type Province = {
  id: string;
  name: string;
  heroImageUrl: string;
  tagline: string;
  landmarksCount: number;
  checkinCountLabel: string;
  badgeCountLabel: string;
  landmarks: Landmark[];
};

export type FeedPost = {
  id: string;
  author: string;
  location: string;
  imageUrl: string;
  likesLabel: string;
  commentsLabel: string;
  caption: string;
  hashtag: string;
};

export type LeaderboardEntry = {
  id: string;
  rank: number | string;
  name: string;
  title: string;
  provinceCountLabel: string;
  avatarUrl: string;
};

export const designAssets = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN6kLgUGks-i553-jJcC-Fo0QWnuvzpPgUDBxRvowqwcXClhbYyXBCbus2NrPRfi228EdE3mixTwII6djIdPRnsusNrMrXY6mthkGS1rdA9L_I4bXix7h4DkArLfKiuixqEQVBjXeTq3_W_bCdx4rDZlwqO8c3bUBE4J_CAZ1qGOqrsBkLkXbpM8prMaZxTLGpQnL9FFK-EW0J6V8XoWM-CW1OFfiHeGjwoYhSRh66RzdcOXtEgslTrCK5nQJAzYgPJtA9dQgPbdpZ',
  vietnamMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXPFt8o0KXdcVK4cVBqoVQz0r-fj79J-wyq6LwACFu5teyorRCWuWdKs46TuziHksRooqLFF1m3AdYaUbhG9XGqSLVvJ9DZQkoHSwK_FPXDMmV_pCiLjJ5IQ42IG2rD2kabK7-xXmC3cGuAzqxRIZBpdDQMA6_33jq2Rb_153a12Q3TtvNgRWopW0nT_goEJemMiCiCKu-fOZA9N8XhBe-FRhkjo9OGdTKhbFWXgQ343i9JujOFablLMhjpLO-SFYFtf1jNPkJADA8',
  danangHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH4sdfoef92oN52hA6Puk2yTL1CZVl9_Ra_iq2eaWH1e4KYzB_sSYgwOhmzNCRHF3wNzU2IXPY5-jV5hGkP8sxIsYtL7XV9ETeX4blJ1zp_YPN9SSWMLpeqYNWwHCSg8itP9ISEKwK7WY7Dd8Z-kpvjcu93-XIGX_370maXIvzUwInLmh2tr7J-Y7SR94qnsaA2mEJbIPCs2n_S_VEUXSqWpO255R0P3t_SmxiQccrlSDodoAU6aGKFuvWFYaDgCVh6vvTO82nZKMH',
  myKhe: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV9ZKHpvbMk3voQvpIltzx_fzKAX-ILdyEScjp3Y_GwbLSq0yzd6ZRV15Z5G3Jss6ggh5W41pQl7fSsrr9ndTJ4_bTDmU-8Wwe8doLM43D1gfOvMheEr4006x0lqctmUlfIwJ4OUGdmzOu5Y4m7MUF8xYa-M3kuoxjahpdnmyXW8hrekZnhdqmUXqqRyRk9_UMLjowp1hctRcTL97Bpmq3Sx1Tu3L6kkR-S5udoVCgDPPnJW1aNTtSNLhnIctgYvkMsFxzysQSZoou',
  dragonBridge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAW8_jy-jyztwnchswe5cvHjaIFMGYSw-R1cUBhVuiqE7Pp2bj5CZ3bKiUIEhUxNRkNPd9Ji3JxZ7VbUKaZDkQvB5FV2FQbEGkVDF8M0DmQjbrqkcM92Xd2gGDG1w9RqvqfpXuwv6dstuyTTgktWkYZS1j3Y5TaU3Eu2NvPZzeVf8iZJR6t4mYAamnYfjOdsOnDAgwxWPqYqbCpKpqLOvLnG364rNCDremjDN_wuYsjEdt3v1Qma2BHEq_Ef7YnO8Md5RQsJjjlsX3',
  phuQuocSunset: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBP6x8oIDtjUWd-Q13qyUNfWZQrzPBAi3fidpxJYlO5a7fQEFescTlNOR_9sTDOFRjULm5by_ak-4qQyN5hpS4gaym7QZkIxWl4Jas-EC3-jiosPErs4Ijf9wcAa5igJmvWxlB7-FviB2PRk4eQ5b_fMRwp75uYr5WmxkiY99N_vQB1JK_fdC_M9RmBc_BQFYoURQfuHyewk2uoEnrYiGeZDXmzkzipDbfMguAO5V4gcWiMUqkWVPVJp8YLkiME7Nbx7yto7GOj4PR7',
  phuQuocStars: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhQUJ4sFSaWfAnKw8w0wDyhDiBb5ndvkCGFDFHY1hAFQZngmN6urmysnNJH1tB7yWsx3Ny07_figlWCaPugaAc5IJ2jBpq0OJtmWlHxlrruAeM90yswsrpnycC_SRhjHh8VuKRrB_rpWo99-yuysMDoj5BbtK0lmOyhRL4q0UnL2jZezi3_04R8h7n0NquxpDxa65RTTFcGMc7NljcXaE0C8COslhLpTWetOPuV4OnS7tqJXbRle6OmblWPb1RYI5aNHrocJbQypJY',
  quangNinh: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCre8kE4Cl_HgZyS25rRTUpaB4FTC0fidoYEhTlQDuvgJi1jhzX6kzv6FoEBFF2I8D8hqEyesvBDbsgLNhUjo0QOM1qjG6SIKg25y5NRwXYQoZm_1plNLvFf27YOS9t-CW0NGtYmkd3fyr4QrfxfwDro_Tlmm0Q6wvjRnVK4PkO6TKa0DzPTeuCe_nWXcoTxpHIX0qNZkdM4CSspnge8IRNyWzCjzSCDljJ5DuoPdKKUhCpetakrcOKeZILgfrkEtw2pBaPWTgbKeaK',
  laoCai: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCo3eqYcNKQK6bVLSmneQk8XDQ6cS5ENYuQ38KU1HLZzTaXpqvmh6bY1edS42RTDaNUjt_erMMxz-w2S0bP4n4NvtUOVT0XZc1jC6TRob4V-pWigHVDRiy90wcjudqr9TqNaAe-zxKSsMtumUtZ7BbfyNrj2s2v9oCdKoRTMT2TQSdAwAt-R3whniy2w7ZDVrY1unslTrmLCw34cQ1AIvZQRmCsBlPK_ywhN5kvjSVwl8l6Ap7C41rkpX-N1IekhHCGyVZ0Bs2KsTF7',
  daNangThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAN4dl09MbjfTlqCgQD5FO-k0dRQtTAeHhbKcde89S2ow6tdo62br9e7QEK5z-MYHA83VANlekMYtra7kaRxbl24r_x2e8iwj9SggYvCYM4n0K0HFN98JFDesGq2T2OZZA23DbVSsd0rpV03cIJvxKcaVGGRnsiCnRHnw48wFCL4UVtWY3t5OZ67cZY_3sa0nzYA-sIZWD9bz-KY3ptZwqBKd-g8DbjJ25F2V4PkjEE-m0mn-q9EdiVpjFpJi9NBea-1FB-9p64QCm',
  registerHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnKJ-QMgeTbcSKUdLRs-XQi_BQGRT_kr1eZ5TToNkLN_TEOyjWXO7TDy9uNTLLB18Z3FcfegLRqJ5mhqUW_0U3UP3nN4eK0FSj9LiUNtKNiiVFGne-IMuwETc31QlfJue5Adz4mR9eH1psW9v5DxaAcbQI2vzYWlzor5elmk9-Z8h2lVIRaw79kjSXE80Jd8QF8gchXGjynamfcmijP7EGbZGbX_Q1QJKLRbimjwKd-Zrf1MMnoZVX8M8qZzuLH9oTTHVzHsglgPN7',
  loginHeroMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_DLB0p8U2xgQIBFU_QX2GUi4LX_8qWjBkOBr9hD-cwy3yHYJJnWRxQ1A9ZTXatpGZf-ZOkLVHCvPQft-7RQgmu9cHOWzZbH1OX-0bXJmiYiDzbR4PNq4KCii9ApIcxti6cD6WEDWkUVcGU8i2sMmG4DEYBAuG4VUNsSFYSPOA7LHKFF08Pp86qJAW-GSTnj6i0FyXek66LJAoJ26x-JZesoCYWI3Ejt9PSbGFzlLdRGmEfvxsU2mi9XezHKhgzJdaUv5nsbG7b7Um',
  cameraBackdrop: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY4yVU6G8OK0CtH7gMp2WdYzyHViw-29zf61udhvGKSiCVr28IOoPqBL9S8zBcbED7EtoYqCk1Ghj_aKkNvlMfC79T-Doq2qT6kXiyLECjO15I8z-a2qpBRgyh1a0D2hG4U6sa7Xipoz_aD2qKRcnPxhNpAMvzCk-e5EXmz1qXhiezee0cH669iqywdh3aZmUZazKXECfXy5arlDhYAPZf7GrT2HJ-1h-i-6UDxbTejVu1SzndrV9gsGfKJpj2aIXvCOvdRZtKhQwG',
  leaderboardMapOutline: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNk8D0j0WvH_bgq2d5Vm2N_1RbhrVH1IGBsYKIk3Cnmum5nYULqEDCGHJN-UIXgGkzAv_e3mi28YwW-kBX_H-Rtnbvs1Uh-BLH1BPGZfk4cZhnwmfrEV9QgazdtIeEuLP21GljA-AGWpHrwgquCjdAhcs74glekn6iA-i9ZjB7IRzK179b172LHNGU5_GZIvXm5S0vsBnUJQhYastdCaTqPILCGt-df3bV2R6noykMvKSKpl3z8wdemguTgJmAqVE2V9KGMMTcIzv1',
  rankSilver: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7_BFyhwzhevR2RVGpTw3dH-xhR5GMXbK-jTnQdLOKouR1plgLACrAKwT0Duqt1j3201Lrwo199aRPuyuGc5XWNsYH1NHBcdpyeutFMGzFIzrfXvtZ8WhQ3bzwyN405s19QI78HKAu1fEiYsoay8yubXYNdFLlZJPPXr79ImTREDgAnZP6LmclAe88jyRLLN7aQDyxYjSvoaIFPkX9spfJV6isLADzatLbHCdAWLkCSOg1I-PuwNXi_j6KArQtu9AIryslHIpb1_Sf',
  rankGold: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApA82F5b9LP-O5zikR10j36BENPg0YKZGQlksuI_Cb62pti7BK_EIoY7iw3s6mJ9vNdRU4kh5T6ZKR_6U923snJ80wt2zONUX9HUfY82KxGburpfqK42mAeInVPQU4edik7VD6mWHTzxA5T8LJO684LSuQBFTpVSTW5BE_lbpX2_hmxFUgl11cfjlx9vrVj8v0SnIFyNKaO1o41BtJDHwscWOOR8UQxGB8AZxtpAZ5IoRub6YC5FWdxbcszCOM7Yj349nkCvy3MISH',
  rankBronze: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgOwfP2KIWfBNZJouaYPndpMWwHacKLZNUR87DuPA1bZlV6OQvunB0DhPa1gSu27wMP87vOgRTIDpXy2T28UfLpziFxZT5BglF1G2PQlh4VOLCq_pQvDrP8bXV-nmLhnY9_hcOsg29R4FkVv74DyxQPcAZLKBbz3q1UlBVkB2DqnbhnMcIcp96R8xMs3VJm5NpBEovSJvZh5y5MEVL77AZlM6dNbe_fBZOKIWesSxgF414gQq65sY39OHaWxIrYc57Gux7sTRvpMAr',
  rank4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD565oEVLFrVsR75uoXJQ0dvT1XJo--CV61bczMtW05aWXiupq-5kVzqnIg3t7RlMtsaqGD8cmo9fmAI37dfSuY65oh1RuJRo3Q34i4lff6b3XF0KmpnUydEpyqJlVHKUnk2dwS8lXGR0dCamWm_uJNPwU-fJc49J5-IkMuALny3y0brHr-O3DreSadK-XoUNKmsD1RsHwN3M4mf0J3YYCUJuDwxAPVPGstucgwlkgrACLyi7Jg5GdJgwf2lBMRncifj3ISY1X14MmN',
  rank5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBlSDLpIQn7VM-JxMyqTj4QERGt6usthu8dreuTwMFvlyukuCC10w4hBHcGpNZ77JlYCh4jz5iGR9URGFAB2YiTmGpXOrN4-WwSmNW7XCPubD9DrRDlvhBvPOiFtUXgqgJnwDW9wHT62VfRZ5Hl8mRtV9SOrxBTzYjItEe_2_m6t_vJrJ-cWoV4XkFXTH_7vUxQZqQVrDZv9ZfqeZRxg7B3k28AswE0KrFSQTImDQXMP4fEJBD5hCTo9GnILRM2F1l4wcTpTmAb2Oz',
  rank6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBATqPjMeKorn3KCbu-c8GghSEd9DGxlWgRCISE5hzZWza7UMEA5Fu2nXBKi1V-dFcNbTiK9N7doci2oov0_KN4V6_QuoLZurqmPCOeHJ7r7OFtrxfEY7ApEDbf8DcQjG7GGNNKR3FsLZe3J4eEg33dzMoor5YKpiAkRWl0UEG1MyIaw2AvGy1hGxC57kiBD76tNzv5AwYg66V8LtitQcx-Wy4ggSUiyBmDt70XFuwERxM48pDNHD7Rp-b9N1QY3hJeySgzfAUAnHQn',
  rank7: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWsHsoGEBMpZwoe7yXRfvkHrsrfX8oNRheQsfaxAcpcmj_kpdGCWmVfHCWAUFgUA-wSMMrx--V2l8CaHbGjzeaphbqU-zcvfBj9jCQwP35nStGU8zHtdT1vRqqxR1tNRAlddb5Jr1oHtKe-oqHQdSqy_vfrzxk6_Pt-qn-at3PettEnaF-UxuHNNkOR4hERjuo_k_XqPKGalwC5VhtLN0nZpoaADUmSuPeN8L8wD7fMP1j1UUPabXyMHLKWnOxOESMmbKcpO6iQzhZ',
  currentUserRank: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeXg69B_c2pqyKCvaP5lsorJiRkmShq2cklZp2eiP0RWtVVxMcpLWgucsubYU5i8Nc10B2ItDYLJdxdw4GIEiUL4whoRXAEz338iM01otq_noc9U7zBrpqGuybWwYZD7V_pkyNmIKPjcDOyFurNGrc1FyAtgXN4g2gioxLpxy2CD5cxhH79xXhxY0ftlpU53j_O-kWFvBstHFcLd3nbq98fh9lBRNeRhlcXwub9ZntqU9vodF4dirt-gXO0GnmGHnyYJ-wjkVx_M_T',
};

export const provinces: Province[] = [
  {
    id: 'danang',
    name: 'Đà Nẵng',
    heroImageUrl: designAssets.danangHero,
    tagline: 'Thành phố biển sôi động với cầu biểu tượng và bãi biển đẹp.',
    landmarksCount: 12,
    checkinCountLabel: '4.8k',
    badgeCountLabel: '05',
    landmarks: [
      {
        id: 'my-khe',
        name: 'My Khe Beach',
        description: 'Một trong những bãi biển đẹp và dễ chill nhất miền Trung.',
        imageUrl: designAssets.myKhe,
        accentColor: '#21b8ef',
        provinceId: 'danang',
      },
      {
        id: 'dragon-bridge',
        name: 'Dragon Bridge',
        description: 'Biểu tượng Đà Nẵng, nổi bật nhất vào buổi tối cuối tuần.',
        imageUrl: designAssets.dragonBridge,
        accentColor: '#f1b81f',
        provinceId: 'danang',
      },
    ],
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Minh Nguyen',
    location: 'Long Beach, Phu Quoc',
    imageUrl: designAssets.phuQuocSunset,
    likesLabel: '2.4k',
    commentsLabel: '128',
    caption: 'Golden hour magic at Long Beach! The water is so warm and clear today.',
    hashtag: '#PhuQuocCheckin',
  },
  {
    id: 'post-2',
    author: 'Linh Cao',
    location: 'Starfish Beach',
    imageUrl: designAssets.phuQuocStars,
    likesLabel: '856',
    commentsLabel: '42',
    caption: 'Look at these little guys! Please remember not to touch them!',
    hashtag: '#SaveTheStarfish',
  },
];

export const collectionItems = [
  {
    id: 'quangninh',
    name: 'Quảng Ninh',
    dateLabel: '15/03/2024',
    imageUrl: designAssets.quangNinh,
  },
  {
    id: 'laocai',
    name: 'Lào Cai',
    dateLabel: '02/02/2024',
    imageUrl: designAssets.laoCai,
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    dateLabel: '20/12/2023',
    imageUrl: designAssets.daNangThumb,
  },
];

export const socialProviders = [
  { id: 'google', label: 'Google', tint: '#ffffff', textColor: '#111827', borderColor: '#e5e7eb' },
  { id: 'zalo', label: 'Zalo', tint: '#0f6bff', textColor: '#ffffff', borderColor: '#0f6bff' },
  { id: 'facebook', label: 'Facebook', tint: '#1877f2', textColor: '#ffffff', borderColor: '#1877f2' },
];

export const leaderboardPodium = [
  { id: 'minhtu', rank: 2, name: 'Minh Tú', provinceCountLabel: '52 tỉnh', avatarUrl: designAssets.rankSilver },
  { id: 'linhnga', rank: 1, name: 'Linh Nga', provinceCountLabel: '60 tỉnh', avatarUrl: designAssets.rankGold },
  { id: 'anhduc', rank: 3, name: 'Anh Đức', provinceCountLabel: '48 tỉnh', avatarUrl: designAssets.rankBronze },
];

export const leaderboardEntries: LeaderboardEntry[] = [
  { id: 'hoangnam', rank: 4, name: 'Hoàng Nam', title: 'Chuyên gia thám hiểm', provinceCountLabel: '45/63', avatarUrl: designAssets.rank4 },
  { id: 'baotram', rank: 5, name: 'Bảo Trâm', title: 'Người đi săn ảnh', provinceCountLabel: '42/63', avatarUrl: designAssets.rank5 },
  { id: 'quochuy', rank: 6, name: 'Quốc Huy', title: 'Tân thủ du ký', provinceCountLabel: '38/63', avatarUrl: designAssets.rank6 },
  { id: 'yennhi', rank: 7, name: 'Yến Nhi', title: 'Phượt thủ nhí', provinceCountLabel: '35/63', avatarUrl: designAssets.rank7 },
  { id: 'me', rank: '99+', name: 'Bạn (Tôi)', title: 'Sắp thăng hạng rồi!', provinceCountLabel: '12/63', avatarUrl: designAssets.currentUserRank },
];