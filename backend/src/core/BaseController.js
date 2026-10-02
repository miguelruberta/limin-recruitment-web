export class BaseController {
  ok(res, data, meta) {
    return res.status(200).json({ success: true, data, meta });
  }

  created(res, data) {
    return res.status(201).json({ success: true, data });
  }

  noContent(res) {
    return res.status(204).end();
  }
}