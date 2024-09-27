// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               v3.9.1
// source: common.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "erp.api_v1";

export enum PartyType {
  /** UNSPECIFIED - Default value */
  UNSPECIFIED = 0,
  supplierGroup = 1,
  itemGroup = 2,
  warehouse = 3,
  stockLevel = 4,
  item = 5,
  itemAttribute = 6,
  itemPrice = 7,
  supplier = 8,
  purchaseOrder = 9,
  tax = 10,
  customer = 11,
  customerGroup = 12,
  admin = 13,
  employee = 14,
  client = 15,
  address = 16,
  contact = 17,
  purchaseInvoice = 18,
  company = 19,
  UNRECOGNIZED = -1,
}

export function partyTypeFromJSON(object: any): PartyType {
  switch (object) {
    case 0:
    case "UNSPECIFIED":
      return PartyType.UNSPECIFIED;
    case 1:
    case "supplierGroup":
      return PartyType.supplierGroup;
    case 2:
    case "itemGroup":
      return PartyType.itemGroup;
    case 3:
    case "warehouse":
      return PartyType.warehouse;
    case 4:
    case "stockLevel":
      return PartyType.stockLevel;
    case 5:
    case "item":
      return PartyType.item;
    case 6:
    case "itemAttribute":
      return PartyType.itemAttribute;
    case 7:
    case "itemPrice":
      return PartyType.itemPrice;
    case 8:
    case "supplier":
      return PartyType.supplier;
    case 9:
    case "purchaseOrder":
      return PartyType.purchaseOrder;
    case 10:
    case "tax":
      return PartyType.tax;
    case 11:
    case "customer":
      return PartyType.customer;
    case 12:
    case "customerGroup":
      return PartyType.customerGroup;
    case 13:
    case "admin":
      return PartyType.admin;
    case 14:
    case "employee":
      return PartyType.employee;
    case 15:
    case "client":
      return PartyType.client;
    case 16:
    case "address":
      return PartyType.address;
    case 17:
    case "contact":
      return PartyType.contact;
    case 18:
    case "purchaseInvoice":
      return PartyType.purchaseInvoice;
    case 19:
    case "company":
      return PartyType.company;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PartyType.UNRECOGNIZED;
  }
}

export function partyTypeToJSON(object: PartyType): string {
  switch (object) {
    case PartyType.UNSPECIFIED:
      return "UNSPECIFIED";
    case PartyType.supplierGroup:
      return "supplierGroup";
    case PartyType.itemGroup:
      return "itemGroup";
    case PartyType.warehouse:
      return "warehouse";
    case PartyType.stockLevel:
      return "stockLevel";
    case PartyType.item:
      return "item";
    case PartyType.itemAttribute:
      return "itemAttribute";
    case PartyType.itemPrice:
      return "itemPrice";
    case PartyType.supplier:
      return "supplier";
    case PartyType.purchaseOrder:
      return "purchaseOrder";
    case PartyType.tax:
      return "tax";
    case PartyType.customer:
      return "customer";
    case PartyType.customerGroup:
      return "customerGroup";
    case PartyType.admin:
      return "admin";
    case PartyType.employee:
      return "employee";
    case PartyType.client:
      return "client";
    case PartyType.address:
      return "address";
    case PartyType.contact:
      return "contact";
    case PartyType.purchaseInvoice:
      return "purchaseInvoice";
    case PartyType.company:
      return "company";
    case PartyType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum InvoiceState {
  /** INVOICE_STATE_UNSPECIFIED - Default value */
  INVOICE_STATE_UNSPECIFIED = 0,
  DRAFT = 1,
  SENT = 2,
  VIEWED = 3,
  PENDING_PAYMENT = 4,
  PARTIALLY_PAID = 5,
  PAID = 6,
  OVERDUE = 7,
  CANCELLED = 8,
  DISPUTED = 9,
  REFUNDED = 10,
  UNRECOGNIZED = -1,
}

export function invoiceStateFromJSON(object: any): InvoiceState {
  switch (object) {
    case 0:
    case "INVOICE_STATE_UNSPECIFIED":
      return InvoiceState.INVOICE_STATE_UNSPECIFIED;
    case 1:
    case "DRAFT":
      return InvoiceState.DRAFT;
    case 2:
    case "SENT":
      return InvoiceState.SENT;
    case 3:
    case "VIEWED":
      return InvoiceState.VIEWED;
    case 4:
    case "PENDING_PAYMENT":
      return InvoiceState.PENDING_PAYMENT;
    case 5:
    case "PARTIALLY_PAID":
      return InvoiceState.PARTIALLY_PAID;
    case 6:
    case "PAID":
      return InvoiceState.PAID;
    case 7:
    case "OVERDUE":
      return InvoiceState.OVERDUE;
    case 8:
    case "CANCELLED":
      return InvoiceState.CANCELLED;
    case 9:
    case "DISPUTED":
      return InvoiceState.DISPUTED;
    case 10:
    case "REFUNDED":
      return InvoiceState.REFUNDED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return InvoiceState.UNRECOGNIZED;
  }
}

export function invoiceStateToJSON(object: InvoiceState): string {
  switch (object) {
    case InvoiceState.INVOICE_STATE_UNSPECIFIED:
      return "INVOICE_STATE_UNSPECIFIED";
    case InvoiceState.DRAFT:
      return "DRAFT";
    case InvoiceState.SENT:
      return "SENT";
    case InvoiceState.VIEWED:
      return "VIEWED";
    case InvoiceState.PENDING_PAYMENT:
      return "PENDING_PAYMENT";
    case InvoiceState.PARTIALLY_PAID:
      return "PARTIALLY_PAID";
    case InvoiceState.PAID:
      return "PAID";
    case InvoiceState.OVERDUE:
      return "OVERDUE";
    case InvoiceState.CANCELLED:
      return "CANCELLED";
    case InvoiceState.DISPUTED:
      return "DISPUTED";
    case InvoiceState.REFUNDED:
      return "REFUNDED";
    case InvoiceState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Result {
  message: string;
}

function createBaseResult(): Result {
  return { message: "" };
}

export const Result: MessageFns<Result> = {
  encode(message: Result, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Result {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseResult();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Result {
    return { message: isSet(object.message) ? globalThis.String(object.message) : "" };
  },

  toJSON(message: Result): unknown {
    const obj: any = {};
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Result>, I>>(base?: I): Result {
    return Result.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Result>, I>>(object: I): Result {
    const message = createBaseResult();
    message.message = object.message ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
