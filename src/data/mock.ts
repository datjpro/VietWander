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
  daNangThumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAN4dl09MbjfTlqCgQD5FO-k0dRQtTAeHhbKcde89S2ow6tdo62br9e7QEK5z-MYHA83VANlekMYtra7kaRxbl24r_x2e8iwj9SggYvCYM4n0K0HFN98JFDesGq2T2OZZA23DbVSsd0rpV03cIJvxKcaVGGRnsiCnRHnw48wFCL4UVtWY3t5OZ67cZY_3sa0nzYA-sIZWD9bz-KY3ptZwqBKd-g8DbjJ25F2V4PkjEE-m0mn-q9EdiVpjFpJi9NBea-1FB-9p64QCm'
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
        provinceId: 'danang'
      },
      {
        id: 'dragon-bridge',
        name: 'Dragon Bridge',
        description: 'Biểu tượng Đà Nẵng, nổi bật nhất vào buổi tối cuối tuần.',
        imageUrl: designAssets.dragonBridge,
        accentColor: '#f1b81f',
        provinceId: 'danang'
      }
    ]
  }
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
    hashtag: '#PhuQuocCheckin'
  },
  {
    id: 'post-2',
    author: 'Linh Cao',
    location: 'Starfish Beach',
    imageUrl: designAssets.phuQuocStars,
    likesLabel: '856',
    commentsLabel: '42',
    caption: 'Look at these little guys! Please remember not to touch them!',
    hashtag: '#SaveTheStarfish'
  }
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
