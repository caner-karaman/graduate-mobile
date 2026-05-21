module.exports = {
  graduation: {
    input: {
      target: './swagger-docs.json',
    },
    output: {
      target: './src/api/generated/graduation.ts',
      client: 'axios-functions',
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
