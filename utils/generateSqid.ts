import Sqids from 'sqids';

const sqids = new Sqids({
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  minLength: 8,
});

export default function generateSqid() {
  const id = sqids.encode([Date.now()]);
  return id;
}
