/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var findOne, find,update, remove;
var utils = require('/modules/utils.js');

(function () {
    var log = new Log();

    var dir = '/store/';

    var utils = require('/modules/utils.js');

    var assetsDir = function (ctx, storeType, type) {
        var carbon = require('carbon');
        var config = require('/configs/designer.json');
        var domain = config.shareStore ? carbon.server.superTenant.domain : ctx.domain;
        return dir + domain + '/' + storeType + '/' + type + '/';
    };

    findOne = function (storeType,type, id) {
        var ctx = utils.currentContext();
        var parent = assetsDir(ctx, storeType, type);
        var file = new File(parent + id);
        if (!file.isExists()) {
            return null;
        }
        file = new File(file.getPath() + '/' + type + '.json');
        if (!file.isExists()) {
            return null;
        }
        file.open('r');
        var asset = JSON.parse(file.readAll());
        file.close();
        return asset;
    };

    find = function (storeType,type, query, start, count) {
        var ctx = utils.currentContext();
        var parent = new File(assetsDir(ctx, storeType, type));
        var assetz = parent.listFiles();
        var assets = [];
        query = query ? new RegExp(query, 'i') : null;
        assetz.forEach(function (file) {
            if (!file.isDirectory()) {
                return;
            }
            file = new File(file.getPath() + '/' + type + '.json');
            if (file.isExists()) {
                file.open('r');
                var asset = JSON.parse(file.readAll());
                if (!query) {
                    assets.push(asset);
                    file.close();
                    return;
                }
                var title = asset.title || '';
                if (!query.test(title)) {
                    file.close();
                    return;
                }
                assets.push(asset);
                file.close();
            }
        });

        var end = start + count;
        end = end > assets.length ? assets.length : end;
        assets = assets.slice(start, end);
        return assets;
    };

    update = function (asset) {

    };

    remove = function (id) {

    };
}());