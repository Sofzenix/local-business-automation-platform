// middlewares/mockAuth.middleware.js
export function mockAuth(req, res, next) {
  req.user = {
    id: "65f000000000000000000001",
    role: "ADMIN",
    businessId: "65f100000000000000000001"
  };
  console.log("mock middleware called ... ")
  next();
}