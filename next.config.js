/** @type {import('next').NextConfig} */

module.exports = {
  async headers() {
    return [
      {
        source: '/api/socket',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
};
