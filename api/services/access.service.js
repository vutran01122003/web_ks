const fetch = require('node-fetch');
const User = require('../models/user.model');
const moment = require('moment');

const role = {
    engineer: '0001',
    talentedEngineer: '0002',
    contentAdministrator: '0003',
    webStructureAdministrator: '0004'
};

class AccessService {
    static login = async (data) => {
        try {
            const { studentId, password } = data;

            const user = await User.findOne({ studentId });

            if (user) {
                const checkPassword = user.checkPassword(password);

                if (checkPassword) {
                    return {
                        isSuccessLogin: true,
                        typePassword: 'password',
                        user
                    };
                }

                return {
                    isSuccessLogin: false,
                    typePassword: 'password'
                };
            } else {
                const res = await fetch('https://opac.iuh.edu.vn/default.aspx', {
                    headers: {
                        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'accept-language':
                            'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    body: `__EVENTTARGET=ctl00%24ucMenuRight%24btnPatronLogon&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwUKLTUzMjU4OTIxNQ9kFgJmD2QWAgIDD2QWCAIFD2QWBAIBDxYCHgRUZXh0BZACPGxpPjxhIGhyZWY9Jy4nIHRhcmdldD0nX3NlbGYnPjxzcGFuPlRoxrAgdmnhu4duIHPhu5E8L3NwYW4%2BPC9hPjwvbGk%2BPGxpPjxhIGhyZWY9J2h0dHBzOi8vb3BhYy5pdWguZWR1LnZuOjgwMDAvc2VhcmNoLycgdGFyZ2V0PSdfdGFyZ2V0Jz48c3Bhbj5UaMawIHZp4buHbiB0cnV54buBbiB0aOG7kW5nPC9zcGFuPjwvYT48L2xpPjxsaT48YSBocmVmPSdaMzk1MENsaWVudC5hc3B4JyB0YXJnZXQ9J19zZWxmJz48c3Bhbj5E4buLY2ggduG7pSBaMzk1MDwvc3Bhbj48L2E%2BPC9saT5kAgMPFgIfAAWQAjxsaT48YSBocmVmPScuJyB0YXJnZXQ9J19zZWxmJz48c3Bhbj5UaMawIHZp4buHbiBz4buRPC9zcGFuPjwvYT48L2xpPjxsaT48YSBocmVmPSdodHRwczovL29wYWMuaXVoLmVkdS52bjo4MDAwL3NlYXJjaC8nIHRhcmdldD0nX3RhcmdldCc%2BPHNwYW4%2BVGjGsCB2aeG7h24gdHJ1eeG7gW4gdGjhu5FuZzwvc3Bhbj48L2E%2BPC9saT48bGk%2BPGEgaHJlZj0nWjM5NTBDbGllbnQuYXNweCcgdGFyZ2V0PSdfc2VsZic%2BPHNwYW4%2BROG7i2NoIHbhu6UgWjM5NTA8L3NwYW4%2BPC9hPjwvbGk%2BZAIJD2QWCAIDD2QWAgIBDxYCHgdWaXNpYmxlaBYCAgEPPCsACwBkAgUPZBYCZg9kFgICAQ8WAh4LXyFJdGVtQ291bnQCBhYMZg9kFghmDxUBBjEyMDY4NmQCAQ8PFgIeCEltYWdlVXJsBSB%2BL0FwcF9UaGVtZXMvSW1hZ2VzL05vSW1hZ2VzLnBuZ2RkAgIPFQEGMTIwNjg2ZAIDDw8WBB8ABUlHaeG6o2kgcGjDoXAgbsOibmcgY2FvIGNo4bqldCBsxrDhu6NuZyBuZ3Xhu5NuIG5ow6JuIGzhu7FjIHThuqFpIEPDtG5nLi4uHgdUb29sVGlwBaUBR2nhuqNpIHBow6FwIG7Dom5nIGNhbyBjaOG6pXQgbMaw4bujbmcgbmd14buTbiBuaMOibiBs4buxYyB04bqhaSBDw7RuZyB0eSBYxINuZyBk4bqndSBRdeG6o25nIE5nw6NpIDpMdeG6rW4gdsSDbiB0aOG6oWMgc8SpIC0gQ2h1ecOqbiBuZ8Ogbmg6IFF14bqjbiB0cuG7iyBraW5oIGRvYW5oZGQCAQ9kFghmDxUBBjEyMDY4NWQCAQ8PFgIfAwUgfi9BcHBfVGhlbWVzL0ltYWdlcy9Ob0ltYWdlcy5wbmdkZAICDxUBBjEyMDY4NWQCAw8PFgQfAAUrSMOgbSBwaOG7qWMgdsOgIHBow6lwIGJp4bq%2FbiDEkeG7lWkgTGFwbGFjZR8EBStIw6BtIHBo4bupYyB2w6AgcGjDqXAgYmnhur9uIMSR4buVaSBMYXBsYWNlZGQCAg9kFghmDxUBBjEyMDY4NGQCAQ8PFgIfAwUgfi9BcHBfVGhlbWVzL0ltYWdlcy9Ob0ltYWdlcy5wbmdkZAICDxUBBjEyMDY4NGQCAw8PFgQfAAUqR2nDoW8gdHLDrG5oIG3huqFjaCDEkWnhu4duIHThu60gbsOibmcgY2FvHwQFKkdpw6FvIHRyw6xuaCBt4bqhY2ggxJFp4buHbiB04butIG7Dom5nIGNhb2RkAgMPZBYIZg8VAQYxMjA2ODNkAgEPDxYCHwMFIH4vQXBwX1RoZW1lcy9JbWFnZXMvTm9JbWFnZXMucG5nZGQCAg8VAQYxMjA2ODNkAgMPDxYEHwAFMUdpw6FvIHRyw6xuaCBjxqEgbMO9IHRodXnhur90IMSR4buZbmcgbOG7sWMgaOG7jWMfBAUxR2nDoW8gdHLDrG5oIGPGoSBsw70gdGh1eeG6v3QgxJHhu5luZyBs4buxYyBo4buNY2RkAgQPZBYIZg8VAQYxMjA2ODJkAgEPDxYCHwMFIH4vQXBwX1RoZW1lcy9JbWFnZXMvTm9JbWFnZXMucG5nZGQCAg8VAQYxMjA2ODJkAgMPDxYEHwAFT0PDoWMgeeG6v3UgdOG7kSDhuqNuaCBoxrDhu59uZyDEkeG6v24gcuG7p2kgcm8gdMOtbiBk4bulbmcgdOG6oWkgbmfDom4gaMOgbmcuLi4fBAXaAUPDoWMgeeG6v3UgdOG7kSDhuqNuaCBoxrDhu59uZyDEkeG6v24gcuG7p2kgcm8gdMOtbiBk4bulbmcgdOG6oWkgbmfDom4gaMOgbmcgVGjGsMahbmcgbeG6oWkgQ%2BG7lSBwaOG6p24gQ8O0bmcgdGjGsMahbmcgVmnhu4d0IE5hbSAtIGNoaSBuaMOhbmggVMOieSBOaW5oIDpMdeG6rW4gdsSDbiBUaOG6oWMgc8SpIC0gQ2h1ecOqbiBuZ8Ogbmg6IFTDoGkgY2jDrW5oIE5nw6JuIGjDoG5nZGQCBQ9kFghmDxUBBjEyMDY4MWQCAQ8PFgIfAwUgfi9BcHBfVGhlbWVzL0ltYWdlcy9Ob0ltYWdlcy5wbmdkZAICDxUBBjEyMDY4MWQCAw8PFgQfAAVLQ8OhYyB54bq%2FdSB04buRIHTDoWMgxJHhu5luZyDEkeG6v24gbOG7o2kgbmh14bqtbiBj4bunYSBjw6FjIG5nw6JuIGjDoG5nLi4uHwQFsAFDw6FjIHnhur91IHThu5EgdMOhYyDEkeG7mW5nIMSR4bq%2FbiBs4bujaSBuaHXhuq1uIGPhu6dhIGPDoWMgbmfDom4gaMOgbmcgdGjGsMahbmcgbeG6oWkgY%2BG7lSBwaOG6p24gVmnhu4d0IE5hbSA6THXhuq1uIHbEg24gVGjhuqFjIHPEqSAtIENodXnDqm4gbmfDoG5oOiBUw6BpIGNow61uaCBOZ8OibiBow6BuZ2RkAgcPZBYCZg9kFgICAQ8WAh8CAgYWDGYPZBYIZg8VAQQ3NTgwZAIBDw8WAh8DBRh3cFZpZXdJbWFnZS5hc2h4P0lkPTc1ODBkZAICDxUBBDc1ODBkAgMPDxYEHwAFRMSQaeG7gXUga2hp4buDbiBuaMOgIHRow7RuZyBtaW5oIHRow7RuZyBxdWEgYmx1ZXRvb3RoIHbDoCDEkWnhu4duLi4uHwQFfcSQaeG7gXUga2hp4buDbiBuaMOgIHRow7RuZyBtaW5oIHRow7RuZyBxdWEgYmx1ZXRvb3RoIHbDoCDEkWnhu4duIHRob%2BG6oWkgOsSQ4buTIMOhbiB04buRdCBuZ2hp4buHcCBraG9hIEPDtG5nIG5naOG7hyDEkGnhu4duZGQCAQ9kFghmDxUBBTE2ODMzZAIBDw8WAh8DBRl3cFZpZXdJbWFnZS5hc2h4P0lkPTE2ODMzZGQCAg8VAQUxNjgzM2QCAw8PFgQfAAVBTOG6rXAgcXV5IHRyw6xuaCBjw7RuZyBuZ2jhu4cgZ2lhIGPDtG5nIGNoaSB0aeG6v3QgWDEwNiA6xJDhu5MuLi4fBAVvTOG6rXAgcXV5IHRyw6xuaCBjw7RuZyBuZ2jhu4cgZ2lhIGPDtG5nIGNoaSB0aeG6v3QgWDEwNiA6xJDhu5Mgw6FuIGNodXnDqm4gbmfDoG5oIGPDtG5nIG5naOG7hyBjaOG6vyB04bqhbyBtw6F5ZGQCAg9kFghmDxUBBTM0MDY5ZAIBDw8WAh8DBRl3cFZpZXdJbWFnZS5hc2h4P0lkPTM0MDY5ZGQCAg8VAQUzNDA2OWQCAw8PFgQfAAVNTmdoacOqbiBj4bupdSDhuqNuaCBoxrDhu59uZyBj4bunYSBt4buZdCBz4buRIGxv4bqhaSDEkcaw4budbmcgbMOqbiBwaOG6qW0uLi4fBAWCAU5naGnDqm4gY%2BG7qXUg4bqjbmggaMaw4bufbmcgY%2BG7p2EgbeG7mXQgc%2BG7kSBsb%2BG6oWkgxJHGsOG7nW5nIGzDqm4gcGjhuqltIGNo4bqldCB0aW5oIGThu4tjaCBjaMOzIHRyb25nIHF1w6EgdHLDrG5oIMSRw7RuZyBs4bqhbmhkZAIDD2QWCGYPFQEFMzQ3NjBkAgEPDxYCHwMFGXdwVmlld0ltYWdlLmFzaHg%2FSWQ9MzQ3NjBkZAICDxUBBTM0NzYwZAIDDw8WBB8ABU5QaMawxqFuZyBwaMOhcCB0w61uaCB0b8OhbiDEkWnhu4duIMOhcCBuaGnhu4V1IGPhu6dhIMSRxrDhu51uZyBkw6J5IMSRaeG7h24uLi4fBAVwUGjGsMahbmcgcGjDoXAgdMOtbmggdG%2FDoW4gxJFp4buHbiDDoXAgbmhp4buFdSBj4bunYSDEkcaw4budbmcgZMOieSDEkWnhu4duIGzhu7FjIHNhbmcgxJHGsOG7nW5nIGTDonkgdGjDtG5nIHRpbmRkAgQPZBYIZg8VAQUzNTAzNmQCAQ8PFgIfAwUZd3BWaWV3SW1hZ2UuYXNoeD9JZD0zNTAzNmRkAgIPFQEFMzUwMzZkAgMPDxYEHwAFTlRo4buxYyBoaeG7h24gbeG7pWMgdGnDqnUgdsaw4bujdCBxdWEgbmfGsOG7oW5nIG7GsOG7m2MgxJFhbmcgcGjDoXQgdHJp4buDbi4uLh8EBYsBVGjhu7FjIGhp4buHbiBt4bulYyB0acOqdSB2xrDhu6N0IHF1YSBuZ8aw4buhbmcgbsaw4bubYyDEkWFuZyBwaMOhdCB0cmnhu4NuIGPDsyBt4bupYyB0aHUgbmjhuq1wIHRo4bqlcCAtIE3hu5l0IHPhu5EgxJHDoW5oIGdpw6EgYmFuIMSR4bqndWRkAgUPZBYIZg8VAQUzNzU2MmQCAQ8PFgIfAwUZd3BWaWV3SW1hZ2UuYXNoeD9JZD0zNzU2MmRkAgIPFQEFMzc1NjJkAgMPDxYEHwAFSU5naGnDqm4gY%2BG7qXUgcGjGsMahbmcgcGjDoXAgcGjhuqduIHThu60gaOG7r3UgaOG6oW4gZOG7sWEgdHLDqm4gc2nDqnUuLi4fBAWRAU5naGnDqm4gY%2BG7qXUgcGjGsMahbmcgcGjDoXAgcGjhuqduIHThu60gaOG7r3UgaOG6oW4gZOG7sWEgdHLDqm4gc2nDqnUgcGjhuqduIHThu60gY8OibiBi4bqxbmcgJiDEkcOhbmggZ2nDoSBjaOG6pXQgbMaw4bujbmcgY%2BG7p2EgcGjGsMahbmcgcGjDoXBkZAIJD2QWBGYPZBYCAgEPFgIfAgIFFgpmD2QWCGYPFQECMTJkAgEPDxYEHwMFOVVwbG9hZC8yMDIzLzEwLzE5L2JhaWJhby5wbmdfMjAyM1RoZzEwMTlfMDkwMjA3NzY5KDEpLnBuZx8EBRVCw6BpIGLDoW8gcXXhu5FjIHThur9kZAICDxUBAjEyZAIDDw8WBB8ABRVCw6BpIGLDoW8gcXXhu5FjIHThur8fBAUVQsOgaSBiw6FvIHF14buRYyB04bq%2FZGQCAQ9kFghmDxUBAjExZAIBDw8WBB8DBTpVcGxvYWQvMjAyMy8xMC8xOS9lYm9vazAxLmpwZ18yMDIzVGhnMTAxOV8wOTU2MjM0NzMoMSkuanBnHwQFG8SQ4buBIHTDoGkgbmdoacOqbiBj4bupdSBLSGRkAgIPFQECMTFkAgMPDxYEHwAFG8SQ4buBIHTDoGkgbmdoacOqbiBj4bupdSBLSB8EBRvEkOG7gSB0w6BpIG5naGnDqm4gY%2BG7qXUgS0hkZAICD2QWCGYPFQECMTRkAgEPDxYEHwMFOlVwbG9hZC8yMDIzLzEwLzE5L2Vib29rb28uanBnXzIwMjNUaGcxMDE5XzA5NDUyOTg5MCgxKS5qcGcfBAUYS2jDs2EgbHXhuq1uIC0gxJDhu5Mgw6FuZGQCAg8VAQIxNGQCAw8PFgQfAAUYS2jDs2EgbHXhuq1uIC0gxJDhu5Mgw6FuHwQFGEtow7NhIGx14bqtbiAtIMSQ4buTIMOhbmRkAgMPZBYIZg8VAQIxMGQCAQ8PFgQfAwU6VXBsb2FkLzIwMjMvMTAvMTkvZWJvb2tvby5qcGdfMjAyM1RoZzEwMTlfMDkxMjIzODMwKDEpLmpwZx8EBRZMdeG6rW4gdsSDbiBUaOG6oWMgc8SpZGQCAg8VAQIxMGQCAw8PFgQfAAUWTHXhuq1uIHbEg24gVGjhuqFjIHPEqR8EBRZMdeG6rW4gdsSDbiBUaOG6oWMgc8SpZGQCBA9kFghmDxUBAjEzZAIBDw8WBB8DBTlVcGxvYWQvMjAyMy8xMC8xOS9iYWliYW8ucG5nXzIwMjNUaGcxMDE5XzA5NDYyMjc0OCgxKS5wbmcfBAUUVOG6oXAgY2jDrSBLSCZDTiBJVUhkZAICDxUBAjEzZAIDDw8WBB8ABRRU4bqhcCBjaMOtIEtIJkNOIElVSB8EBRRU4bqhcCBjaMOtIEtIJkNOIElVSGRkAgIPEGRkFgFmZAILD2QWCgIFD2QWCAIBDw8WAh8ABQEwZGQCAw8PFgIfAAUBMGRkAgUPDxYCHwAFATBkZAIHDw8WAh8ABQEwZGQCCQ8PFgIfAAUNPGI%2BMTcuMjcyPC9iPmRkAgsPZBYEZg8PFgIfAAUJOS45NTQuNjkyZGQCAQ9kFgJmD2QWBgIBDxBkEBUMCFRow6FuZyAxCFRow6FuZyAyCFRow6FuZyAzCFRow6FuZyA0CFRow6FuZyA1CFRow6FuZyA2CFRow6FuZyA3CFRow6FuZyA4CFRow6FuZyA5CVRow6FuZyAxMAlUaMOhbmcgMTEJVGjDoW5nIDEyFQwBMQEyATMBNAE1ATYBNwE4ATkCMTACMTECMTIUKwMMZ2dnZ2dnZ2dnZ2dnFgECCWQCAw8QZBAVCAQyMDE2BDIwMTcEMjAxOAQyMDE5BDIwMjAEMjAyMQQyMDIyBDIwMjMVCAQyMDE2BDIwMTcEMjAxOAQyMDE5BDIwMjAEMjAyMQQyMDIyBDIwMjMUKwMIZ2dnZ2dnZ2cWAQIHZAIFDw8WAh8ABQcyNDMuMzIzZGQCDQ9kFgJmDxYCHwBlZAIPDxBkZBYBZmQCDQ9kFgQCAQ8WAh8BZxYCAgEPFgIfAAWIATxsaT48YSBocmVmPSdJbmRleC5hc3B4JyB0YXJnZXQ9J19zZWxmJz5UcmFuZyBjaOG7pzwvYT48L2xpPjxsaT48YSBocmVmPSdUcmFuZ1RpblNvRG9UcmFuZy5hc3B4JyB0YXJnZXQ9J19zZWxmJz5TxqEgxJHhu5MgdHJhbmc8L2E%2BPC9saT5kAgMPFgIfAAWwATxkaXYgY2xhc3M9ImNvbC0xMCI%2BPHNwYW4gc3R5bGU9ImZvbnQtc2l6ZToxNHB4Ij4mY29weTsgMjAxOSBUcnVuZyB0w6JtIFRoxrAgdmnhu4duIC0gVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC4gSOG7kyBDaMOtIE1pbmgmbmJzcDs8L3NwYW4%2BPC9kaXY%2BCgo8cD4mbmJzcDs8L3A%2BZGSly2ixgyVyGNmLiSsk70%2FiUhzta1gP1BFTE7EJLe9IOw%3D%3D&__VIEWSTATEGENERATOR=CA0B0334&__EVENTVALIDATION=%2FwEdACXppcjJLIFNqqBvfbaYXlcl2VMRVUdkl4dZOqjCWAZf80DLiP7AN6FP3AGxXCfU4%2FH%2ByCSO2Vg9%2BB0KJwQ%2FJW3aUgvXvd9likMsqqYnhMsaLjOubdb0Q3cVkdfrr2otCYy0IIkRm3i0l08qlvd9lZifCMA1R3eXiVjICQJJRvXgLqfeVUVGpGIxVUrmh8zFkIIz30Dp7N0p836sBLxkAG03YGVKM9ulrN33G6dqPPzS%2BIQXQ0jueHnZKMyRmYOKwQ2N6ipsMuC90pz0idLUqDYeBGGrTA8bppTiER0lDqOLOEKih3xdBfki8RKQ6U%2BMCWkNwEnrNP8W4CJvr5hn1%2BjCsd2mWQAKwAxQ2dv0cHF4lFS12NfBpKqr%2B562qxAIeI6MJeRRJF%2Fg%2BVdaa4D1FS4ac9e3AcrEOnhcUJ81rPqOdSNcki7m89DTY8Rw4iJxIeiyrRotywYHb5aUe9DDmYGhR7bp09XTGyPcfajwJ01tMbJJ0LY%2F7zkczQZy1WXjeospyXakx%2BcUZxYiiCxKZ4wmWkhPgr4pC8mvt0HxzSNVcCjLh4YkJ8Q%2BIamkAqW1h9svdkc3s9q0dZM2%2FJI4CgP1T3A6YWNBFphMGPzfq1Xa7366WgpFMmTcWpwRcipt44BKDRmXXZz0ZzvADULv4nUTZ0VAfr3Lp%2FM1nz%2FFW%2BRmdxFb%2F01maZ7tUTg8Bki%2BSOFF4qyTq%2FVGXOz8Dm3W%2FK7tBmQP%2F9r52hdmqPVoWAhQHOsMBfXo%2FkxCBFSxtcSciB3wedNSnxZ4vHQJG97f3ykOfAf902gqXqrrCMbthjp3Iy%2BgRg6GAt%2BkJWQfTOXFQ3g%3D&ctl00%24phContent%24ucTailieuSo2TraCuuNhanh%24ddlFieldName1=All&ctl00%24phContent%24ucTailieuSo2TraCuuNhanh%24txtTitle=&ctl00%24phContent%24ucTailieuSo2TraCuuNhanh%24txtMsg=Ch%C6%B0a+c%C3%B3+%C4%91i%E1%BB%81u+ki%E1%BB%87n+t%C3%ACm+ki%E1%BA%BFm%21&ctl00%24ucMenuRight%24txtCardNumber=${studentId}&ctl00%24ucMenuRight%24txtPassword=${password}&ctl00%24ucMenuRight%24ucPortalLeftStatistic%24ddlMonth=10&ctl00%24ucMenuRight%24ucPortalLeftStatistic%24ddlYear=2023`,
                    method: 'POST'
                });

                const resText = await res.text();
                if (
                    !resText.includes(
                        'Đăng nhập KHÔNG thành công, vui lòng kiểm tra thông tin tài khoản hoặc Hạn sử dụng!'
                    )
                ) {
                    return {
                        isSuccessLogin: true,
                        typePassword: 'birthday'
                    };
                } else {
                    return {
                        isSuccessLogin: false,
                        typePassword: 'birthday'
                    };
                }
            }
        } catch (error) {
            throw error;
        }
    };

    static register = async (data) => {
        try {
            const { studentId, fullName, password, birthday, major, email, phone } = data;

            const createdUser = new User({
                studentId,
                fullName,
                password,
                birthday: moment(birthday, 'DD/MM/YYYY').toDate(),
                major,
                email,
                phone,
                roles: [role.engineer]
            });

            await createdUser.save();

            return createdUser;
        } catch (error) {
            throw error;
        }
    };

    static getUserInfo = async (userId) => {
        try {
            const user = await User.findById(userId).select('-password').lean();
            return user;
        } catch (error) {
            throw error;
        }
    };
}

module.exports = AccessService;
