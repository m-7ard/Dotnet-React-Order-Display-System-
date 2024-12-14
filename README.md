
# Dotnet 8.0 React Order Display System




## Run Locally

### Setup


Clone the project

```bash
  >> git clone https://github.com/m-7ard/Dotnet-React-Order-Display-System-.git
```

```bash
  In the "Api" folder, create a .env file like .env_pattern and fill it with your MSSQL database access data
```

```bash
  In the "frontend" folder, create a .env file like .env_pattern and fill it with the url of the host if necessary
```


**BACKEND** Install NuGet dependencies

```bash
  >> dotnet restore
```

**BACKEND** Go to the backend directory

```bash
  >> cd Api
```

**BACKEND** Start the backend server

```bash
  >> dotnet watch run
  or >> dotnet publish -c Release

```

Go to the frontend directory

```bash
  cd frontend
```

**FRONTEND** Install frontned dependencies
```bash
  >> npm i
```

**FRONTEND** Start the frontend server

```bash
  >> npm run dev
```


## Features

- Manage Products
- Automatically create Product Histories / Archives
- Manage Orders
- Save / Upload & Manage Product Images
- Backend Integration Tests
- Backend Application Layer Unit Tests
- Frontend Validation





## Screenshots

**Create Product Page**
![Create Product Page](https://i.imgur.com/4phmheO.png)

**Create Product Page (mobile)**
![Create Product Page (mobile)](https://i.imgur.com/OXKlJDs.png)

**List Products Page**
![List Products Page](https://i.imgur.com/384j8h9.png)

**List Product Page (mobile)**
![List Product Page (mobile)](https://i.imgur.com/A6KCk51.png)

**Filter Products Modal Form Tab**
![Filter Products Modal Form Tab](https://i.imgur.com/YWLV503.png)

**Filter Products Modal Results Tab**
![Filter Products Modal Results Tab](https://i.imgur.com/7FGUg1x.png)

**Create Order Page**
![Create Order Page](https://i.imgur.com/oEkJ1Q5.png)

**List Orders Page (mobile)**
![List Orders Page (mobile)](https://i.imgur.com/uQOf7Df.png)

*List Orders Page (full)**
![List Orders Page (full)](https://i.imgur.com/E9fZJWk.png)

**List Product Histories Page**
![List Product Histories Page](https://i.imgur.com/NLnu3S2.png)

**Frontpage**
![Frontpage](https://i.imgur.com/SGHS78r.png)


## Lessons Learned

**The Value of Unit Tests and Integration Tests**

This application was originally only loosely following the DDD methodology. Howver, as redundancies were found (calculating the total of an Order, updating Product images), a large refactor took place, which included changing autoincrement keys to GUID, creation of domain events, domain methods; Which would've been far more complex to complete without the help of Unit Tests & Integration Tests to check the correctness of the end result of the refactor.

**The Value of Separating Component Logic and UI Views**

This application originally used a single component architecture in React for pages, but was refactored to use a Presenter-Controller component architecture to clearly separate the state and fetch related logic from our view, effectively making for more Unit Testable and reusable components.

**The Value of Meaningful Errors in the Application Layer**

This Application uses validation error codes in the application layer, effectively letting us delegate an appropriate response in our controllers.
# API Reference

## Products API Endpoints

### Create Product

```http
POST /api/products/create
```

#### Request Body

| Field       | Type         | Description                     | Constraints                     |
|:------------|:-------------|:--------------------------------|:--------------------------------|
| name        | string       | Product name                    | Required, max length validation |
| price       | decimal      | Product price                   | Required, positive value        |
| description | string       | Product description             | Optional                        |
| images      | List<string> | List of image URLs for product  | Max 8 images                    |

#### Responses

- `201 Created`: Product successfully created
- `400 Bad Request`: Validation errors

### List Products

```http
GET /api/products/list
```

#### Query Parameters

| Parameter     | Type     | Description                         | 
|:--------------|:---------|:------------------------------------|
| id            | Guid     | Filter by specific product ID       |
| name          | string   | Filter by product name              |
| minPrice      | decimal  | Minimum price filter                |
| maxPrice      | decimal  | Maximum price filter                |
| description   | string   | Filter by product description       |
| createdBefore | DateTime | Filter products created before date  |
| createdAfter  | DateTime | Filter products created after date   |
| orderBy       | string   | Sort products by specific field     |

#### Responses

- `200 OK`: Returns list of products
- `400 Bad Request`: Invalid query parameters

### Read Product

```http
GET /api/products/{id}
```

#### Path Parameters

| Parameter | Type | Description                |
|:----------|:-----|:---------------------------|
| id       | Guid | Required. Product ID   |

#### Responses

- `200 OK`: Returns product details
- `404 Not Found`: Product doesn't exist
- `400 Bad Request`: Invalid request

### Update Product

```http
PUT /api/products/{id}/update
```

#### Path Parameters

| Parameter | Type | Description                |
|:----------|:-----|:---------------------------|
| id       | Guid | Required. Product ID   |

#### Request Body

| Field       | Type         | Description                     | Constraints                     |
|:------------|:-------------|:--------------------------------|:--------------------------------|
| name        | string       | Product name                    | Required, max length validation |
| price       | decimal      | Product price                   | Required, positive value        |
| description | string       | Product description             | Optional                        |
| images      | List<string> | List of image URLs for product  | Max 8 images                    |

#### Responses

- `200 OK`: Product successfully updated
- `400 Bad Request`: Validation errors
- `404 Not Found`: Product doesn't exist
- `409 Conflict`: Integrity error

### Delete Product

```http
POST /api/products/{id}/delete
```

#### Path Parameters

| Parameter | Type | Description                |
|:----------|:-----|:---------------------------|
| id       | Guid | Required. Product ID   |

#### Responses

- `200 OK`: Product successfully deleted
- `400 Bad Request`: Invalid request
- `404 Not Found`: Product doesn't exist
- `409 Conflict`: Integrity error

## Orders API Endpoints

### Create Order

```http
POST /api/orders/create
```

#### Request Body

| Parameter                   | Type   | Description                                      |
|:----------------------------|:-------|:-------------------------------------------------|
| orderItemData               | object | Required. Dictionary of order items           |
| orderItemData[uid].productId| string | Required. ID of the product                  |
| orderItemData[uid].quantity | number | Required. Quantity of the product            |

### List Orders

```http
GET /api/orders/list
```

#### Query Parameters

| Parameter       | Type     | Description                                      |
|:----------------|:---------|:-------------------------------------------------|
| id              | string   | Optional. Filter by specific order ID            |
| minTotal        | number   | Optional. Minimum total order amount             |
| maxTotal        | number   | Optional. Maximum total order amount             |
| status          | string   | Optional. Filter by order status                 |
| createdBefore   | datetime | Optional. Orders created before this date        |
| createdAfter    | datetime | Optional. Orders created after this date         |
| productId       | string   | Optional. Filter by specific product ID          |
| productHistoryId| string   | Optional. Filter by product history ID           |
| orderBy         | string   | Optional. Specify ordering of results            |

### Read Order

```http
GET /api/orders/{id}
```

#### Path Parameters

| Parameter | Type   | Description                                |
|:----------|:-------|:-------------------------------------------|
| id        | string | Required. ID of order to fetch         |

### Mark Order Item Finished

```http
PUT /api/orders/{orderId}/item/{orderItemId}/mark_finished
```

#### Path Parameters

| Parameter     | Type   | Description                                |
|:--------------|:-------|:-------------------------------------------|
| orderId       | string | Required. ID of the order              |
| orderItemId   | string | Required. ID of the order item to mark as finished |

### Mark Order Finished

```http
PUT /api/orders/{orderId}/mark_finished
```

#### Path Parameters

| Parameter | Type   | Description                                |
|:----------|:-------|:-------------------------------------------|
| orderId   | string | Required. ID of the order to mark as finished |

## Draft Images API Endpoints

### Upload Images

```http
POST /api/draft_images/upload_images
```

#### Request Body

| Parameter      | Type     | Description                                      |
|:---------------|:---------|:-------------------------------------------------|
| files          | file[]   | Required. List of image files to upload      |

#### Constraints

- Maximum of 8 files per upload
- Maximum 8 MB per file
- Allowed extensions: .jpg, .jpeg, .png

## Product Histories API Endpoints

### List Product Histories

```http
GET /api/product_histories/list
```

#### Query Parameters

| Parameter     | Type     | Description                                      |
|:--------------|:---------|:-------------------------------------------------|
| name          | string   | Optional. Filter by product name                 |
| minPrice      | number   | Optional. Minimum product price                  |
| maxPrice      | number   | Optional. Maximum product price                  |
| description   | string   | Optional. Filter by product description          |
| validTo       | datetime | Optional. Products valid before this date        |
| validFrom     | datetime | Optional. Products valid after this date         |
| productId     | string   | Optional. Filter by specific product ID          |
| orderBy       | string   | Optional. Specify ordering of results            |

## Error Handling

The API returns structured error responses with:
- Error codes
- Detailed error messages
- Paths to specific validation errors

### Common Error Codes

- `ModelDoesNotExist`: Requested resource not found
- `IntegrityError`: Database integrity constraint violation

## Authentication

Currently, the endpoint allows anonymous access.
