const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

const contactControllers = {
  create: async (req, res) => {
    if (!req.body?.name) {
      return next(new ApiError(400, "Name can not be empty"));
    }
    try {
      const contactService = new ContactService(MongoDB.client);

      const document = await contactService.create(req.body);
      return res.send(document);
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(500, "An error occurred while creating the contact")
      );
    }
  },
  findAll: async (req, res, next) => {
    let documents = [];
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    try {
      if (name) {
        documents = await contactService.findByName(name);
      } else {
        documents = await contactService.find();
      }
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(500, "An error occurred while findAll contacts")
      );
    }
    return res.send(documents);
  },
  findOne: async (req, res, next) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.findById(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }
      return res.send(document);
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(500, "An error occurred while findOne contacts")
      );
    }
  },
  update: async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.update(req.params.id, req.body);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }
      return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "An error occurred while update contacts"));
    }
  },
  delete: async (req, res, next) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.delete(req.params.id);
      if (!document) {
        return next(new ApiError(404, "Contact not found"));
      }
      return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
      console.log(error);
      return next(new ApiError(500, "An error occurred while delete contacts"));
    }
  },
  deleteAll: async (req, res) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const document = await contactService.deleteAll();
      return res.send({ message: "Contact was deleteAll successfully" });
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(500, "An error occurred while deleteAll contacts")
      );
    }
  },
  findAllFavorite: async (req, res) => {
    try {
      const contactService = new ContactService(MongoDB.client);
      const documents = await contactService.findFavorite();
      return res.send(documents);
    } catch (error) {
      console.log(error);
      return next(
        new ApiError(500, "An error occurred while findAllFavorite contacts")
      );
    }
  },
};

module.exports = { contactControllers };
