using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Voucher.cloud.Controllers
{
    public class ImportsController : Controller
    {
        // GET: ImportsController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ImportsController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ImportsController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ImportsController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ImportsController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ImportsController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ImportsController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ImportsController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
