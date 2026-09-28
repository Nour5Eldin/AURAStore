const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, '../fashion-store-backend/src/controllers/category.controller.ts');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

if (!controllerContent.includes('getAdminSubcategories')) {
    const searchString = 'res.status(200).json(ApiResponse.ok(subcategories));\n    });';
    
    const insertStr = `

    getAdminSubcategories = asyncHandler(async (req: Request, res: Response) => {
        const result = await subcategoryRepository.paginate(
            {},
            { sort: { createdAt: -1 }, page: Number(req.query.page || 1), limit: Number(req.query.limit || 100) }
        );
        res.status(200).json(ApiResponse.ok(result));
    });`;
    
    controllerContent = controllerContent.replace(searchString, searchString + insertStr);
    fs.writeFileSync(controllerPath, controllerContent);
    console.log("Updated category.controller.ts");
}

const routesPath = path.join(__dirname, '../fashion-store-backend/src/routes/admin.routes.ts');
let routesContent = fs.readFileSync(routesPath, 'utf8');

if (!routesContent.includes('router.get("/subcategories"')) {
    routesContent = routesContent.replace(
        'router.post("/subcategories", validate(createSubcategorySchema), categoryController.createSubcategory);',
        'router.get("/subcategories", categoryController.getAdminSubcategories);\nrouter.post("/subcategories", validate(createSubcategorySchema), categoryController.createSubcategory);'
    );
    fs.writeFileSync(routesPath, routesContent);
    console.log("Updated admin.routes.ts");
}
